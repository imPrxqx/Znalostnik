using System.Data;
using backend.Data;
using backend.DTOs;
using backend.Evaluators;
using backend.GameModes;
using backend.Hubs;
using backend.Models;
using backend.Runtime;
using backend.Schemas;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class SessionService : ISessionService
    {
        private readonly ApplicationDbContext _context;
        private readonly JsonSchemaValidator _jsonSchemaValidator;
        private readonly IEvaluatorResolver _evaluators;
        private readonly IHubContext<SessionHub> _sessionHubContext;
        private readonly IGameModeResolver _gameModes;
        private readonly IRuntimeSessionStore _runtimeSessionStore;

        public SessionService(
            ApplicationDbContext context,
            IHubContext<SessionHub> sessionHubContext,
            IGameModeResolver gameModes,
            IEvaluatorResolver evaluators,
            IRuntimeSessionStore runtimeSessionStore,
            JsonSchemaValidator jsonSchemaValidator
        )
        {
            _sessionHubContext = sessionHubContext;
            _context = context;
            _gameModes = gameModes;
            _evaluators = evaluators;
            _runtimeSessionStore = runtimeSessionStore;
            _jsonSchemaValidator = jsonSchemaValidator;
        }

        public async Task<Result<SessionReportDto>> GetSessionReport(UserDto user, Guid sessionId)
        {
            var session = await _context.Sessions.FindAsync(sessionId);

            if (session == null)
            {
                return Result<SessionReportDto>.Failure(Errors.SessionNotFound);
            }

            var activities = await _context
                .Activities.Where(a => a.ExerciseId == session.ExerciseId)
                .OrderBy(a => a.Order)
                .ToListAsync();

            var submissions = await _context
                .Submissions.Include(s => s.Answers)
                .Include(s => s.SessionUser)
                .Include(s => s.Team)
                .Where(s => s.SessionId == sessionId)
                .ToListAsync();

            var answers = submissions.SelectMany(s => s.Answers).OrderBy(a => a.CreatedAt).ToList();

            List<ParticipantDto> participants;

            if (session.RespondType == "team")
            {
                participants = submissions
                    .Where(s => s.Team != null)
                    .Select(s => new ParticipantDto { Id = s.Id, Name = s.Team!.Name })
                    .ToList();
            }
            else
            {
                participants = submissions
                    .Where(s => s.SessionUser != null)
                    .Select(s => new ParticipantDto { Id = s.Id, Name = s.SessionUser!.Username })
                    .ToList();
            }

            var report = session.ToSessionReportDto(participants, activities, answers);

            return Result<SessionReportDto>.Success(report);
        }

        public async Task<Result<SessionDto>> CreateSessionAsync(UserDto user, CreateSessionDto dto)
        {
            var exercise = await _context
                .Exercises.Include(e => e.Activities)
                .FirstOrDefaultAsync(e =>
                    e.Id == dto.ExerciseId && e.UserId == user.Id && e.IsSnapshot == false
                );

            if (exercise == null)
            {
                return Result<SessionDto>.Failure(Errors.ExerciseNotFound);
            }

            // Check if game mode can be resolved
            IGameMode mode = _gameModes.Resolve(dto.GameMode);

            var activities = await _context
                .Activities.Where(et => et.ExerciseId == dto.ExerciseId)
                .OrderBy(et => et.Order)
                .ToListAsync();

            if (activities.Count == 0)
            {
                return Result<SessionDto>.Failure(Errors.InvalidOperation);
            }

            // Creates copies of activites from exercise
            var runtimeActivities = activities
                .Select(a => new RuntimeActivity
                {
                    Id = Guid.NewGuid(),
                    Type = a.Type,
                    Content = a.Content,
                    Style = a.Style,
                    Solution = a.Solution,
                    Order = a.Order,
                })
                .ToList();

            // Creates runtime session and add to runtime sesion store
            var session = new RuntimeSession
            {
                ExerciseId = dto.ExerciseId,
                ActivityIds = runtimeActivities.Select(a => a.Id).ToList(),
                Activities = runtimeActivities.ToList(),
                Title = dto.Title,
                Status = "lobby",
                RespondType = dto.RespondType,
                GameMode = dto.GameMode,
                GameSetting = dto.GameSetting,
                AccessCode = await GenerateAccessCodeAsync(),
                CreatedByUserId = user.Id,
            };

            _runtimeSessionStore.CreateSession(session);
            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result<Guid>> JoinSessionAsync(UserDto user, CreateSessionUserDto dto)
        {
            var session = _runtimeSessionStore.GetSession(dto.AccessCode);

            if (session == null)
            {
                return Result<Guid>.Failure(Errors.SessionNotFound);
            }

            // Host cannot be as participant
            if (session.CreatedByUserId == user.Id)
            {
                return Result<Guid>.Failure(Errors.InvalidOperation);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            // Is user already joined, if yes return session id
            if (sessionUser != null)
            {
                return Result<Guid>.Success(session.Id);
            }

            var newSessionUser = new RuntimeSessionUser
            {
                UserId = user.Id,
                Username = dto.UserName,
            };

            session.SessionUsers.Add(newSessionUser);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<Guid>.Success(session.Id);
        }

        public async Task<Result<AnswerDto>> UpdateAnswerAsync(
            UserDto user,
            Guid sessionId,
            CreateAnswerDto dto
        )
        {
            var activityToValid = await GetSessionExerciseActivityAsync(
                user,
                sessionId,
                dto.ActivityId
            );

            if (activityToValid.IsFailure)
            {
                return Result<AnswerDto>.Failure(Errors.ExerciseActivityNotFound);
            }

            // Validates againts json schema, if answer is valid againts selected activity
            if (
                !_jsonSchemaValidator.Validate(
                    "Answers",
                    activityToValid.Value.Type,
                    dto.Submit.RootElement.GetRawText()
                )
            )
            {
                return Result<AnswerDto>.Failure(Errors.AnswerNotValid);
            }

            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<AnswerDto>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<AnswerDto>.Failure(Errors.SessionUserNotFound);
            }

            var participantId = GetParticipantIdAsync(session, sessionUser);

            if (participantId == null)
            {
                return Result<AnswerDto>.Failure(Errors.NotFound);
            }

            IGameMode mode;

            mode = _gameModes.Resolve(session.GameMode);

            Guid? activeActivityId = null;

            activeActivityId = mode.GetParticipantActivityId(participantId.Value, session);

            if (activeActivityId == null)
            {
                return Result<AnswerDto>.Failure(Errors.NotYourTurn);
            }

            // Get current answer in game mode and updates current answer
            var answer = GetAnswerById(session, participantId.Value, activeActivityId.Value);

            if (answer == null)
            {
                return Result<AnswerDto>.Failure(Errors.AnswerNotFound);
            }

            if (answer.ActivityId != dto.ActivityId)
            {
                return Result<AnswerDto>.Failure(Errors.AnswerNotFound);
            }

            answer.Version += 1;
            answer.Status = "Draft";
            answer.Submit = dto.Submit.RootElement.GetRawText();

            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<AnswerDto>.Success(answer.ToAnswerDto());
        }

        public async Task<Result<AnswerDto>> ConfirmAnswerAsync(
            UserDto user,
            Guid sessionId,
            CreateAnswerDto dto
        )
        {
            var activityToValid = await GetSessionExerciseActivityAsync(
                user,
                sessionId,
                dto.ActivityId
            );

            if (activityToValid.IsFailure)
            {
                return Result<AnswerDto>.Failure(Errors.ExerciseActivityNotFound);
            }

            // Validates againts json schema, if answer is valid againts selected activity
            if (
                !_jsonSchemaValidator.Validate(
                    "Answers",
                    activityToValid.Value.Type,
                    dto.Submit.RootElement.GetRawText()
                )
            )
            {
                return Result<AnswerDto>.Failure(Errors.AnswerNotValid);
            }

            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<AnswerDto>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<AnswerDto>.Failure(Errors.SessionUserNotFound);
            }

            var participantId = GetParticipantIdAsync(session, sessionUser);

            if (participantId == null)
            {
                return Result<AnswerDto>.Failure(Errors.NotFound);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            Guid? activeActivityId = null;
            activeActivityId = mode.GetParticipantActivityId(participantId.Value, session);

            if (activeActivityId == null)
            {
                return Result<AnswerDto>.Failure(Errors.NotYourTurn);
            }

            // Get current answer in game mode and updates and confirm submitted answer
            var answer = GetAnswerById(session, participantId.Value, activeActivityId.Value);

            if (answer == null)
            {
                return Result<AnswerDto>.Failure(Errors.AnswerNotFound);
            }

            if (answer.ActivityId != dto.ActivityId)
            {
                return Result<AnswerDto>.Failure(Errors.AnswerNotFound);
            }

            answer.Version += 1;
            answer.Status = "Submitted";
            answer.Submit = dto.Submit.RootElement.GetRawText();

            var activity = session.Activities.FirstOrDefault(et => et.Id == activeActivityId);

            if (activity == null)
            {
                return Result<AnswerDto>.Failure(Errors.ExerciseActivityNotFound);
            }

            // For confirmed answer evaluate answer for game mode
            IAnswerEvaluator evaluator;

            try
            {
                evaluator = _evaluators.Resolve(activity.Type);
            }
            catch (InvalidOperationException)
            {
                return Result<AnswerDto>.Failure(Errors.InvalidOperation);
            }

            evaluator.Evaluate(activity, answer);

            var assignments = mode.OnAnswer(participantId.Value, session, answer.CorrectPercentage);

            InitializeAnswersAsync(session, assignments);

            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<AnswerDto>.Success(answer.ToAnswerDto());
        }

        public async Task<Result<SessionDto>> StartSessionAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.SessionNotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            // Checks if in session has every participant joined team, without this session cannot be started
            if (session.RespondType == "team")
            {
                var teamMemberIds = session.Teams.SelectMany(t => t.TeamMemberIds).ToList();

                var hasEveryoneTeam = session.SessionUsers.All(su => teamMemberIds.Contains(su.Id));

                if (hasEveryoneTeam == false)
                {
                    return Result<SessionDto>.Failure(Errors.NotEverybodyHaveTeam);
                }
            }

            var participantIds = GetParticipantIdsAsync(session);

            // Can be game mode started with current data
            var validation = mode.ValidateStart(session, participantIds);

            if (validation.IsFailure)
            {
                return Result<SessionDto>.Failure(validation.Error);
            }

            session.Status = "active";

            // Gets activity assignments a for each assignemnts creates empty answer for updating submitted answer
            var activityAssignments = mode.Start(session, participantIds);

            InitializeAnswersAsync(session, activityAssignments);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result<SessionDto>> EndSessionAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.SessionNotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            session.Status = "finished";

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            // Save final game state and save into database as archived session
            mode.End(session);

            // Create archived exercise
            var snapShotExercise = new Exercise
            {
                UserId = session.CreatedByUserId,
                Title = session.Title,
                IsSnapshot = true,
            };

            await _context.Exercises.AddAsync(snapShotExercise);

            // Create for each used activity in runtime session and save to exercise
            foreach (var activity in session.Activities)
            {
                var snapShopActivity = new Activity
                {
                    Id = activity.Id,
                    Type = activity.Type,
                    Order = activity.Order,
                    Style = activity.Style,
                    Content = activity.Content,
                    Solution = activity.Solution,
                    ExerciseId = snapShotExercise.Id,
                };

                await _context.AddAsync(snapShopActivity);
            }
            var newSession = new Session
            {
                Id = session.Id,
                RespondType = session.RespondType,
                Title = session.Title,
                Status = session.Status,
                GameMode = session.GameMode,
                AccessCode = session.AccessCode,
                GameState = session.GameState,
                ExerciseId = snapShotExercise.Id,
                CreatedByUserId = session.CreatedByUserId,
            };

            var submissionMap = new Dictionary<(string type, Guid ownerId), Submission>();

            // Saves answer for session user or team by submission
            foreach (var sessionUser in session.SessionUsers)
            {
                var newSessionUser = new SessionUser
                {
                    Id = sessionUser.Id,
                    SessionId = newSession.Id,
                    UserId = sessionUser.UserId,
                    Username = sessionUser.Username,
                };

                var newSubmission = new Submission
                {
                    SessionId = newSession.Id,
                    SessionUserId = newSessionUser.Id,
                };

                submissionMap[("individual", newSessionUser.Id)] = newSubmission;

                newSessionUser.Submission = newSubmission;
                newSession.SessionUsers.Add(newSessionUser);
                newSession.Submissions.Add(newSubmission);
            }

            // Create archived team used for runtime session
            foreach (var team in session.Teams)
            {
                var newTeam = new Team
                {
                    Id = team.Id,
                    Name = team.Name,
                    SessionId = newSession.Id,
                };

                var newSubmission = new Submission
                {
                    SessionId = newSession.Id,
                    TeamId = newTeam.Id,
                };

                submissionMap[("team", newTeam.Id)] = newSubmission;

                newSession.Submissions.Add(newSubmission);
                newSession.Teams.Add(newTeam);

                foreach (var teamMember in team.TeamMemberIds)
                {
                    var newTeamMember = new TeamMember
                    {
                        TeamId = newTeam.Id,
                        SessionUserId = teamMember,
                    };

                    newTeam.TeamMembers.Add(newTeamMember);
                }
            }

            // Create archived answer used for runtime session
            foreach (var answer in session.Answers)
            {
                if (
                    !submissionMap.TryGetValue(
                        (answer.OwnerType, answer.OwnerId),
                        out var submission
                    )
                )
                {
                    continue;
                }

                var newAnswer = new Answer
                {
                    Submit = answer.Submit,
                    SubmissionId = submission.Id,
                    CreatedAt = answer.CreatedAt,
                    Status = answer.Status,
                    ActivityId = answer.ActivityId,
                    CorrectPercentage = answer.CorrectPercentage,
                };

                submission.Answers.Add(newAnswer);
            }

            // Remove active session and save archived session to database
            await _context.Sessions.AddAsync(newSession);
            await _context.SaveChangesAsync();
            _runtimeSessionStore.DeleteSession(session.Id);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result<SessionDto>> NextActivityAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.SessionNotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            // Get all new activity assignments and creates for each empty answer
            var activityAssignments = mode.OnNextRoundStart(session);
            InitializeAnswersAsync(session, activityAssignments);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result<SessionDto>> PreviousActivityAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.SessionNotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            // Get all new activity assignments and creates for each empty answer
            var activityAssignments = mode.OnPreviousRoundStart(session);
            InitializeAnswersAsync(session, activityAssignments);

            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result> OnTimerEnd(Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result.Failure(Errors.SessionNotFound);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);
            // Change game state after timer end
            mode.ProcessStateTransition(session);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result.Success();
        }

        public async Task<Result<SessionDto>> EndSessionRoundAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.SessionNotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);
            mode.OnRoundEnd(session);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");
            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result<SessionDto>> GetSessionAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.SessionNotFound);
            }

            var role = await GetSessionRoleAsync(user, sessionId);

            if (role.IsFailure)
            {
                return Result<SessionDto>.Failure(role.Error);
            }

            var dto = session.ToSessionDto();
            dto.Role = role.Value;

            if (session.Status == "lobby")
            {
                return Result<SessionDto>.Success(dto);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (session.CreatedByUserId != user.Id && sessionUser == null)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            var activeActivities = new List<ActivityDTO>();

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            if (role.Value == "participant")
            {
                if (sessionUser == null)
                {
                    return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
                }

                var participantId = GetParticipantIdAsync(session, sessionUser);

                if (participantId == null)
                {
                    return Result<SessionDto>.Failure(Errors.InvalidOperation);
                }

                dto.GameState = mode.GetGameState(session, role.Value, participantId);
            }

            if (role.Value == "host")
            {
                dto.GameState = mode.GetGameState(session, role.Value, null);
            }

            return Result<SessionDto>.Success(dto);
        }

        public async Task<Result<string>> GetSessionRoleAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<string>.Failure(Errors.SessionNotFound);
            }

            if (session.CreatedByUserId == user.Id)
            {
                return Result<string>.Success("host");
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser != null)
            {
                return Result<string>.Success("participant");
            }

            return Result<string>.Failure(Errors.UnauthorizedAccess);
        }

        public async Task<Result<ActivityDTO?>> GetActivityAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<ActivityDTO?>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<ActivityDTO?>.Failure(Errors.SessionUserNotFound);
            }

            var participantId = GetParticipantIdAsync(session, sessionUser);

            if (participantId == null)
            {
                return Result<ActivityDTO?>.Failure(Errors.NotFound);
            }

            IGameMode mode = _gameModes.Resolve(session.GameMode);

            Guid? activeActivityId = null;

            activeActivityId = mode.GetParticipantActivityId(participantId.Value, session);

            if (activeActivityId == null)
            {
                return Result<ActivityDTO?>.Failure(Errors.NotYourTurn);
            }

            var activity = session.Activities.FirstOrDefault(et => et.Id == activeActivityId.Value);

            return Result<ActivityDTO?>.Success(activity?.ToActivityDto());
        }

        public async Task<Result<ActivityDTO>> GetSessionExerciseActivityAsync(
            UserDto user,
            Guid sessionId,
            Guid activityId
        )
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<ActivityDTO>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<ActivityDTO>.Failure(Errors.SessionUserNotFound);
            }

            var activity = session.Activities.FirstOrDefault(et => et.Id == activityId);

            if (activity == null)
            {
                return Result<ActivityDTO>.Failure(Errors.ExerciseActivityNotFound);
            }

            return Result<ActivityDTO>.Success(activity.ToActivityDto());
        }

        public async Task<Result<SessionUserDto>> GetSessionUserAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<SessionUserDto>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<SessionUserDto>.Failure(Errors.SessionUserNotFound);
            }

            return Result<SessionUserDto>.Success(sessionUser.ToSessionUserDto());
        }

        public async Task<Result<IEnumerable<SessionUserDto>>> GetSessionUsersAsync(
            UserDto user,
            Guid sessionId
        )
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<IEnumerable<SessionUserDto>>.Failure(Errors.SessionNotFound);
            }

            return Result<IEnumerable<SessionUserDto>>.Success(
                session.SessionUsers.Select(su => su.ToSessionUserDto()).ToList()
            );
        }

        public async Task<Result<TeamDto>> JoinSessionTeamAsync(
            UserDto user,
            Guid sessionId,
            Guid teamId
        )
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<TeamDto>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<TeamDto>.Failure(Errors.SessionUserNotFound);
            }

            var team = session.Teams.FirstOrDefault(t => t.Id == teamId);

            if (team == null)
            {
                return Result<TeamDto>.Failure(Errors.TeamNotFound);
            }

            var inTeam = session.Teams.FirstOrDefault(t =>
                t.TeamMemberIds.Contains(sessionUser.Id)
            );

            if (inTeam != null)
            {
                if (inTeam.Id == teamId)
                {
                    return Result<TeamDto>.Success(inTeam.ToTeamDto(session.SessionUsers));
                }

                inTeam.TeamMemberIds.Remove(sessionUser.Id);

                if (inTeam.TeamMemberIds.Count == 0)
                {
                    session.Teams.Remove(inTeam);
                }
            }

            team.TeamMemberIds.Add(sessionUser.Id);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");

            return Result<TeamDto>.Success(team.ToTeamDto(session.SessionUsers));
        }

        public async Task<Result<TeamDto>> CreateSessionTeamAsync(
            UserDto user,
            Guid sessionId,
            CreateTeamDto dto
        )
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<TeamDto>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<TeamDto>.Failure(Errors.SessionUserNotFound);
            }

            var inTeam = session.Teams.FirstOrDefault(t =>
                t.TeamMemberIds.Contains(sessionUser.Id)
            );

            if (inTeam != null)
            {
                inTeam.TeamMemberIds.Remove(sessionUser.Id);

                if (inTeam.TeamMemberIds.Count == 0)
                {
                    session.Teams.Remove(inTeam);
                }
            }

            var team = new RuntimeTeam();
            team.Name = dto.Name;
            team.TeamMemberIds.Add(sessionUser.Id);
            session.Teams.Add(team);

            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("SessionUpdated");

            return Result<TeamDto>.Success(team.ToTeamDto(session.SessionUsers));
        }

        public async Task<Result<TeamDto>> GetMySessionTeamAsync(UserDto user, Guid sessionId)
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<TeamDto>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (sessionUser == null)
            {
                return Result<TeamDto>.Failure(Errors.SessionUserNotFound);
            }

            var team = session.Teams.FirstOrDefault(t => t.TeamMemberIds.Contains(sessionUser.Id));

            if (team == null)
            {
                return Result<TeamDto>.Failure(Errors.TeamNotFound);
            }

            return Result<TeamDto>.Success(team.ToTeamDto(session.SessionUsers));
        }

        public async Task<Result<IEnumerable<TeamDto>>> GetSessionTeamsAsync(
            UserDto user,
            Guid sessionId
        )
        {
            var session = _runtimeSessionStore.GetSession(sessionId);

            if (session == null)
            {
                return Result<IEnumerable<TeamDto>>.Failure(Errors.SessionNotFound);
            }

            var sessionUser = session.SessionUsers.FirstOrDefault(su => su.UserId == user.Id);

            if (session.CreatedByUserId != user.Id && sessionUser == null)
            {
                return Result<IEnumerable<TeamDto>>.Failure(Errors.UnauthorizedAccess);
            }

            var teams = session.Teams;
            var teamDtos = teams.Select(t => t.ToTeamDto(session.SessionUsers));

            return Result<IEnumerable<TeamDto>>.Success(teamDtos);
        }

        public async Task<Result<IEnumerable<SessionDto>>> GetActiveSessions(UserDto user)
        {
            var sessions = _runtimeSessionStore.GetSessions(user);
            return Result<IEnumerable<SessionDto>>.Success(
                sessions.Select(rs => rs.ToSessionDto()).ToList()
            );
        }

        public async Task<Result<IEnumerable<SessionDto>>> GetFinishedSessions(UserDto user)
        {
            var sessions = await _context
                .Sessions.Where(s => s.CreatedByUserId == user.Id)
                .Select(s => s.ToSessionDto())
                .ToListAsync();

            return Result<IEnumerable<SessionDto>>.Success(sessions);
        }

        public async Task<Result> DeleteSessionAsync(UserDto user, Guid sessionId)
        {
            // Find active session
            var sessionInMemory = _runtimeSessionStore.GetSession(sessionId);

            if (sessionInMemory != null)
            {
                if (sessionInMemory.CreatedByUserId != user.Id)
                {
                    return Result.Failure(Errors.UnauthorizedAccess);
                }

                if (_runtimeSessionStore.DeleteSession(sessionId))
                {
                    return Result.Success();
                }
                else
                {
                    return Result.Failure(Errors.SessionNotFound);
                }
            }

            // Find finished session
            var sessionInDatabase = await _context.Sessions.FirstOrDefaultAsync(s =>
                s.Id == sessionId
            );

            if (sessionInDatabase != null)
            {
                if (sessionInDatabase.CreatedByUserId != user.Id)
                {
                    return Result.Failure(Errors.UnauthorizedAccess);
                }

                _context.Sessions.Remove(sessionInDatabase);
                await _context.SaveChangesAsync();
                return Result.Success();
            }

            return Result.Failure(Errors.SessionNotFound);
        }

        /// <summary>
        /// Generates unique code which can be used for runtime session
        /// </summary>
        /// <returns>Unique code for runtime session</returns>
        private async Task<string> GenerateAccessCodeAsync()
        {
            const string chars = "1234567890";
            var random = new Random();

            while (true)
            {
                var code = new string(
                    Enumerable.Range(0, 6).Select(_ => chars[random.Next(chars.Length)]).ToArray()
                );

                var exists = _runtimeSessionStore.GetSession(code);

                if (exists == null)
                {
                    return code;
                }
            }
        }

        /// <summary>
        /// Returns runtime answer used in runtime session by team or individual.
        /// </summary>
        /// <param name="session">Session id</param>
        /// <param name="ownerId">Owner id of team or individual</param>
        /// <param name="activityId">Activity id</param>
        /// <returns>Runtime answer</returns>
        private RuntimeAnswer? GetAnswerById(RuntimeSession session, Guid ownerId, Guid activityId)
        {
            return session
                .Answers.Where(a => a.ActivityId == activityId && a.OwnerId == ownerId)
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefault();
        }

        /// <summary>
        /// Returns for current session user participant id.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="sessionUser">Runtime session user</param>
        /// <returns>Participant id</returns>
        private Guid? GetParticipantIdAsync(RuntimeSession session, RuntimeSessionUser sessionUser)
        {
            var respondMode = session.RespondType.ToLower();

            if (respondMode == "individual")
            {
                return sessionUser.Id;
            }

            if (respondMode == "team")
            {
                var team = session.Teams.FirstOrDefault(t =>
                    t.TeamMemberIds.Contains(sessionUser.Id)
                );

                if (team != null)
                {
                    return team.Id;
                }
            }

            return null;
        }

        /// <summary>
        /// Returns all joined participant ids for current runtime session.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>All joined participant ids</returns>
        private List<Guid> GetParticipantIdsAsync(RuntimeSession session)
        {
            var respondMode = session.RespondType.ToLower();

            if (respondMode == "individual")
            {
                return session.SessionUsers.Select(su => su.Id).ToList();
            }

            if (respondMode == "team")
            {
                return session.Teams.Select(t => t.Id).ToList();
            }

            return new List<Guid>();
        }

        /// <summary>
        /// Initialize empty answer for each activity assignemnts and adds to runtime session.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="assignments">Activity assignemnts</param>
        private void InitializeAnswersAsync(
            RuntimeSession session,
            List<ActivityAssignment> assignments
        )
        {
            foreach (var a in assignments)
            {
                var newAnswer = new RuntimeAnswer
                {
                    OwnerId = a.ParticipantId,
                    ActivityId = a.ActivityId,
                    OwnerType = session.RespondType,
                    Status = "Empty",
                    CreatedAt = DateTime.UtcNow,
                };

                session.Answers.Add(newAnswer);
            }
        }
    }
}
