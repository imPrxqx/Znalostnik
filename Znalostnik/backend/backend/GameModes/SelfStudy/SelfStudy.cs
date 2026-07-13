using System.Text.Json;
using backend.Algorithms;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.GameModes
{
    /// <summary>
    /// Implements self study game mode where all particiapnts are answering in their own temp.
    /// </summary>
    public class SelfStudy : IGameMode
    {
        public string GameModeType => "selfStudy";

        private readonly ISelectionAlgorithmResolver _algorithms;

        public SelfStudy(ISelectionAlgorithmResolver algorithms)
        {
            _algorithms = algorithms;
        }

        /// <summary>
        /// Validates if session can be started.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="participantIds">Participants list which will be participating in session</param>
        /// <returns>Success if there are at least one participants. If not validation error</returns>
        public Result ValidateStart(RuntimeSession session, List<Guid> participantIds)
        {
            if (participantIds.Count == 0)
            {
                return Result.Failure(Errors.NotEnoughtParticipants);
            }

            return Result.Success();
        }

        /// <summary>
        /// Starts game mode and creates initial activity assignemnts.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="participantIds">Participants list which will be participating in session</param>
        /// <returns>Initial activity assignments for participants</returns>
        public List<ActivityAssignment> Start(RuntimeSession session, List<Guid> participantIds)
        {
            var state = LoadState(session);

            // Init base state for game state in session
            state.SelectionAlgorithm = session.GameSetting.SelectionAlgorithm;
            state.Participants = new List<Guid>(participantIds);
            state.Scores = participantIds
                .Select(p => new ParticipantSelfStudyScore
                {
                    ParticipantId = p,
                    CompletedCount = 0,
                    CorrectCount = 0,
                })
                .ToList();
            state.ParticipantsState = participantIds
                .Select(p => new AlgorithmsState { Id = p })
                .ToList();
            state.ActivityInstances = new List<ActivityInstance>();
            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var activities = session.Activities;

            foreach (var participantId in participantIds)
            {
                var participantState = state.ParticipantsState.First(p => p.Id == participantId);

                var activity = algorithm.SelectNextActivity(activities, participantState);

                state.ActivityInstances.Add(
                    new ActivityInstance
                    {
                        ParticipantId = participantId,
                        PreviousActivityId = null,
                        ActivityId = activity.Id,
                    }
                );
            }

            SaveState(session, state);

            // Creates for every participant activity assignment
            var assignments = new List<ActivityAssignment>();

            foreach (var participant in state.ActivityInstances)
            {
                assignments.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant.ParticipantId,
                        ActivityId = participant.ActivityId,
                    }
                );
            }

            return assignments;
        }

        /// <summary>
        /// Returns the current game state based on role (host or participant)
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="role">participant or host</param>
        /// <param name="participantId">Participant id if participant role</param>
        /// <returns>Game state</returns>
        /// <exception cref="NotSupportedException">Throws when role is not correct or participant role is missing id</exception>
        public object GetGameState(RuntimeSession session, string role, Guid? participantId)
        {
            var state = LoadState(session);

            if (role == "host")
            {
                return GetHostState(state, session);
            }

            if (role == "participant")
            {
                if (participantId == null)
                {
                    throw new NotSupportedException("ParticipantId is required");
                }

                return GetParticipantState(state, session, participantId.Value);
            }

            throw new NotSupportedException($"Role '{role}' is not supported");
        }

        public Guid? GetParticipantActivityId(Guid participantId, RuntimeSession session)
        {
            var state = LoadState(session);

            var activityInstance = state.ActivityInstances.Find(p =>
                p.ParticipantId == participantId
            );

            if (activityInstance == null)
            {
                throw new InvalidOperationException(
                    $"Participant with id {participantId} doesnt have activity in session {session.Id}"
                );
            }

            return activityInstance.ActivityId;
        }

        /// <summary>
        /// Handles a participant answer and select new activity and updates game state.
        /// </summary>
        /// <param name="participantId">Participant id</param>
        /// <param name="session">Runtime session</param>
        /// <param name="correctPercentile">How much is answer correct</param>
        /// <returns>No new activity assignemnts</returns>
        /// <exception cref="InvalidOperationException">Throws when scoring method is not correctly defined -- should not happen</exception>
        public List<ActivityAssignment> OnAnswer(
            Guid participantId,
            RuntimeSession session,
            int correctPercentile
        )
        {
            var state = LoadState(session);

            // Add score for participant in leaderboard
            var score = state.Scores.FirstOrDefault(s => s.ParticipantId == participantId);

            if (score == null)
            {
                throw new InvalidOperationException("Score not found");
            }

            score.CompletedCount++;
            score.CorrectCount += correctPercentile / 100.0;

            var instance = state.ActivityInstances.FirstOrDefault(a =>
                a.ParticipantId == participantId
            );

            if (instance == null)
            {
                throw new InvalidOperationException("Activity instance not found");
            }

            // select new activity from adaptive algorithm and update new algorithm state
            instance.PreviousActivityId = instance.ActivityId;

            var participantState = state.ParticipantsState.First(p => p.Id == participantId);
            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var currentActivity = session.Activities.First(a => a.Id == instance.ActivityId);
            algorithm.UpdateParticipantState(participantState, currentActivity, correctPercentile);
            var next = algorithm.SelectNextActivity(session.Activities, participantState);
            instance.ActivityId = next.Id;
            SaveState(session, state);

            var assignments = new List<ActivityAssignment>();

            // Create new assignemnt for this new activity
            var newActivityAssignemnt = new ActivityAssignment
            {
                ParticipantId = participantId,
                ActivityId = next.Id,
            };

            assignments.Add(newActivityAssignemnt);
            return assignments;
        }

        /// <summary>
        /// Not used in this mode.
        /// </summary>
        /// <param name="session">Runtime session</param>
        public void End(RuntimeSession session) { }

        /// <summary>
        /// Not used in this mode.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>No new activity assignments</returns>
        public List<ActivityAssignment> OnNextRoundStart(RuntimeSession session)
        {
            return new List<ActivityAssignment>();
        }

        /// <summary>
        /// Not used in this mode.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>No new activity assignments</returns>
        public List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session)
        {
            return new List<ActivityAssignment>();
        }

        /// <summary>
        /// Not used in this mode.
        /// </summary>
        /// <param name="session"></param>
        public void OnRoundEnd(RuntimeSession session) { }

        /// <summary>
        /// Not used in this mode.
        /// </summary>
        /// <param name="session"></param>
        public void ProcessStateTransition(RuntimeSession session) { }

        /// <summary>
        /// Loads game state in session.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>Game state</returns>
        private SelfStudyState LoadState(RuntimeSession session)
        {
            if (session.GameState == null)
            {
                return new SelfStudyState();
            }

            var state = JsonSerializer.Deserialize<SelfStudyState>(session.GameState);

            if (state == null)
            {
                return new SelfStudyState();
            }

            return state;
        }

        /// <summary>
        /// Saves game state in session
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="state">Game state</param>
        private void SaveState(RuntimeSession session, SelfStudyState state)
        {
            var jsonString = JsonSerializer.Serialize(state);
            session.GameState = jsonString;
        }

        /// <summary>
        /// Returns for the current participant his activity
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="activityId">Activity id</param>
        /// <returns>Participant current activity</returns>
        /// <exception cref="InvalidOperationException">Throws when participant have not activity</exception>
        private RuntimeActivity GetActivity(RuntimeSession session, Guid activityId)
        {
            var activity = session.Activities.FirstOrDefault(a => a.Id == activityId);

            if (activity == null)
            {
                throw new InvalidOperationException(
                    $"Activity with id {activityId} not found in session {session.Id}"
                );
            }

            return activity;
        }

        /// <summary>
        /// Returns game state for host in session.
        /// </summary>
        /// <param name="state">Game state</param>
        /// <param name="session">Runtime session</param>
        /// <returns>Game state</returns>
        private object GetHostState(SelfStudyState state, RuntimeSession session)
        {
            var leaderboard = state
                .Scores.Select(s =>
                {
                    var activityId = GetParticipantActivityId(s.ParticipantId, session);

                    return new
                    {
                        participantId = s.ParticipantId,
                        correctCount = s.CorrectCount,
                        completedCount = s.CompletedCount,
                        activity = GetActivity(session, activityId!.Value).ToActivityDto(),
                    };
                })
                .ToList();

            return new { leaderboard };
        }

        /// <summary>
        /// Returns game state for participant in session.
        /// </summary>
        /// <param name="state">Game state</param>
        /// <param name="session">Runtime session</param>
        /// <param name="participantId">Participant id</param>
        /// <returns>Game state</returns>
        /// <exception cref="InvalidOperationException">Throws when game state is not right</exception>
        private object GetParticipantState(
            SelfStudyState state,
            RuntimeSession session,
            Guid participantId
        )
        {
            var instance = state.ActivityInstances.FirstOrDefault(a =>
                a.ParticipantId == participantId
            );

            if (instance == null)
            {
                throw new InvalidOperationException("Activity instance not found");
            }

            var score = state.Scores.FirstOrDefault(s => s.ParticipantId == participantId);

            if (score == null)
            {
                throw new InvalidOperationException(
                    $"Participant with id {participantId} doesnt have score"
                );
            }

            var currentAnswer = session
                .Answers.Where(a =>
                    a.ActivityId == instance.ActivityId && a.OwnerId == participantId
                )
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefault();

            if (currentAnswer == null)
            {
                throw new InvalidOperationException(
                    $"Participant with id {participantId} doesnt have created answer"
                );
            }

            // Find last answer to get feedback for participant
            var lastAnswer = session
                .Answers.Where(a =>
                    a.OwnerId == participantId
                    && a.ActivityId == instance.PreviousActivityId
                    && a.Id != currentAnswer.Id
                )
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefault();

            object? lastFeedback = null;

            if (lastAnswer != null)
            {
                lastFeedback = new
                {
                    activity = GetActivity(session, lastAnswer.ActivityId).ToActivityDto(),
                    answer = lastAnswer.ToAnswerDto(),
                };
            }

            return new
            {
                score = new
                {
                    correctCount = score.CorrectCount,
                    completedCount = score.CompletedCount,
                },
                feedback = lastFeedback,
                activity = GetActivity(session, instance.ActivityId).ToActivityWithoutSolutionDto(),
                answer = currentAnswer.ToAnswerDto(),
            };
        }
    }
}
