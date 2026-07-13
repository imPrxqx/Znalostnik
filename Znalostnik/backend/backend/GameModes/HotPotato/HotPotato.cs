using System.Text.Json;
using backend.Algorithms;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.GameModes
{
    /// <summary>
    /// Implements hot potato game mode where all particiapnts are competing each other and be last winner.
    /// </summary>
    public class HotPotato : IGameMode
    {
        public string GameModeType => "hotPotato";

        private Random _random = new Random();
        private readonly ISelectionAlgorithmResolver _algorithms;

        /// <summary>
        /// How many should be active hot potation on each round based on count of alive participants
        /// </summary>
        private readonly int potatoesPerParticipants = 5;

        public HotPotato(ISelectionAlgorithmResolver algorithms)
        {
            _algorithms = algorithms;
        }

        /// <summary>
        /// Validates if session can be started.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="participantIds">Participants list which will be participating in session</param>
        /// <returns>Success if there are at least two participants. If not validation error</returns>
        public Result ValidateStart(RuntimeSession session, List<Guid> participantIds)
        {
            if (participantIds.Count < 2)
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
            state.TimerRound = session.GameSetting.RoundTime;
            state.SelectionAlgorithm = session.GameSetting.SelectionAlgorithm;
            state.Status = StatusPotato.GetReady;
            state.TimerEnd = null;
            state.PotatoInstances.Clear();
            state.AliveParticipants = new List<Guid>(participantIds);
            state.Participants = new List<Guid>(participantIds);
            state.AvailableActivities = new List<Guid>(session.ActivityIds);
            state.ParticipantsState = participantIds
                .Select(p => new AlgorithmsState { Id = p })
                .ToList();

            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var activities = session.Activities;

            // Creates for every participant new potato which is not active
            foreach (var participantId in state.AliveParticipants)
            {
                var participantState = state.ParticipantsState.First(p => p.Id == participantId);
                var activity = algorithm.SelectNextActivity(activities, participantState);

                state.PotatoInstances.Add(
                    new PotatoInstance { ParticipantId = participantId, ActivityId = activity.Id }
                );
            }

            // Take count of potatoes on new round and activated it
            var activeCount = Math.Max(1, state.AliveParticipants.Count / potatoesPerParticipants);

            var activePotatoes = state
                .PotatoInstances.Where(p => !p.IsActive)
                .OrderBy(_ => _random.Next())
                .Take(activeCount)
                .ToList();

            foreach (var p in activePotatoes)
            {
                p.IsActive = true;
            }

            state.Status = StatusPotato.GetReady;
            state.TimerEnd = DateTimeOffset.Now.AddSeconds(6);

            SaveState(session, state);

            // Creates for every participant with active hot potato activity assignment
            var assignments = new List<ActivityAssignment>();

            foreach (var participant in activePotatoes)
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
        /// Not used in this mode.
        /// </summary>
        /// <param name="session">Runtime session</param>
        public void End(RuntimeSession session) { }

        /// <summary>
        /// Handles a participant answer and select new activity when incorrect or select random participant and activate his potato and updates game state.
        /// </summary>
        /// <param name="participantId">Participant id</param>
        /// <param name="session">Runtime session</param>
        /// <param name="correctPercentile">How much is answer correct</param>
        /// <returns>New activity assignemnts</returns>
        /// <exception cref="InvalidOperationException">Throws when game state is wrong -- should not happen</exception>
        public List<ActivityAssignment> OnAnswer(
            Guid participantId,
            RuntimeSession session,
            int correctPercentile
        )
        {
            var state = LoadState(session);

            if (state.Status != StatusPotato.Answering)
            {
                return new List<ActivityAssignment>();
            }

            var potato = state.PotatoInstances.FirstOrDefault(p =>
                p.ParticipantId == participantId
            );

            if (potato == null)
            {
                throw new InvalidOperationException(
                    $"There should be potato for participant with id {participantId} in session {session.Id}"
                );
            }

            if (!potato.IsActive)
            {
                return new List<ActivityAssignment>();
            }

            // Select adaptive algorithm, select new activity and update his algorithm state even if his answer is correct or not
            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var participantState = state.ParticipantsState.First(p => p.Id == potato.ParticipantId);
            var currentActivity = session.Activities.First(a => a.Id == potato.ActivityId);
            algorithm.UpdateParticipantState(participantState, currentActivity, correctPercentile);
            potato.PreviousActivityId = potato.ActivityId;
            potato.ActivityId = algorithm
                .SelectNextActivity(session.Activities, participantState)
                .Id;

            PotatoInstance activePotato;

            if (correctPercentile == 100)
            {
                // Select random participant and activate his potato
                var newParticipantId = SelectRandomParticipant(state, participantId);
                activePotato = state.PotatoInstances.First(pi =>
                    pi.ParticipantId == newParticipantId
                );
                activePotato.PreviousActivityId = null;
                activePotato.IsActive = true;
                potato.IsActive = false;
            }
            else
            {
                activePotato = potato;
            }

            SaveState(session, state);

            // Creates new activity assignment
            var assignments = new List<ActivityAssignment>();

            var newActivityAssignemnt = new ActivityAssignment
            {
                ParticipantId = activePotato.ParticipantId,
                ActivityId = activePotato.ActivityId,
            };

            assignments.Add(newActivityAssignemnt);

            return assignments;
        }

        /// <summary>
        /// Handles a next round by selecting new hot potatoes based on alive participants and updates game state.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>New activity assignemnts</returns>
        public List<ActivityAssignment> OnNextRoundStart(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.Status != StatusPotato.Results)
            {
                return new List<ActivityAssignment>();
            }

            if (state.AliveParticipants.Count < 2)
            {
                return new List<ActivityAssignment>();
            }

            // Creates for every participant new potato which is not active
            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var activities = session.Activities;

            foreach (var participantId in state.AliveParticipants)
            {
                var participantState = state.ParticipantsState.First(p => p.Id == participantId);
                var activity = algorithm.SelectNextActivity(activities, participantState);

                state.PotatoInstances.Add(
                    new PotatoInstance { ParticipantId = participantId, ActivityId = activity.Id }
                );
            }

            // Take count of potatoes on new round and activated it
            var activeCount = Math.Max(1, state.AliveParticipants.Count / potatoesPerParticipants);

            var activePotatoes = state
                .PotatoInstances.Where(p => !p.IsActive)
                .OrderBy(_ => _random.Next())
                .Take(activeCount)
                .ToList();

            foreach (var p in activePotatoes)
            {
                p.IsActive = true;
            }

            state.Status = StatusPotato.GetReady;
            state.TimerEnd = DateTimeOffset.UtcNow.AddSeconds(6);

            SaveState(session, state);

            // Creates for every participant with active hot potato activity assignment

            var assignments = new List<ActivityAssignment>();

            foreach (var participant in activePotatoes)
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
        /// Not used in this mode.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>No new activity assignment</returns>
        public List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session)
        {
            return new List<ActivityAssignment>();
        }

        /// <summary>
        /// Handles a end round, explode all hot potatoes and shows results for participants and host.
        /// </summary>
        /// <param name="session">Runtime session</param>
        public void OnRoundEnd(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.Status != StatusPotato.Answering)
            {
                return;
            }

            // Explode all active hot potatoes and eliminates all participants who has active potato
            foreach (var potato in state.PotatoInstances)
            {
                if (potato.IsActive)
                {
                    state.AliveParticipants.Remove(potato.ParticipantId);
                }
            }

            // Clear all potatoes and when new round start, new potatoes are created
            state.PotatoInstances.Clear();
            state.TimerEnd = null;
            state.Status = StatusPotato.Results;

            SaveState(session, state);
        }

        /// <summary>
        /// Handles timer end. If ended, change state and updates game state.
        /// </summary>
        /// <param name="session"></param>
        public void ProcessStateTransition(RuntimeSession session)
        {
            var state = LoadState(session);

            // Did timer ended
            if (state.TimerEnd == null || state.TimerEnd > DateTime.UtcNow)
            {
                return;
            }

            // If timer ended, change based on state in game mode and apply new state and updates game state.
            switch (state.Status)
            {
                case StatusPotato.GetReady:
                    state.Status = StatusPotato.Answering;
                    state.TimerEnd = DateTimeOffset.Now.AddSeconds(state.TimerRound);
                    SaveState(session, state);
                    break;

                case StatusPotato.Answering:
                    OnRoundEnd(session);
                    break;

                case StatusPotato.Results:
                    OnNextRoundStart(session);
                    break;
                default:
                    state.TimerEnd = null;
                    break;
            }
        }

        /// <summary>
        /// Returns for the current participant current id activity
        /// </summary>
        /// <param name="participantId">Participant id</param>
        /// <param name="session">Runtime session</param>
        /// <returns>Activity id</returns>
        public Guid? GetParticipantActivityId(Guid participantId, RuntimeSession session)
        {
            var state = LoadState(session);

            var potato = state.PotatoInstances.FirstOrDefault(pi =>
                pi.ParticipantId == participantId
            );

            if (potato == null)
            {
                return null;
            }

            return potato.ActivityId;
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

        /// <summary>
        /// Returns a activity
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="activityId">Activity id</param>
        /// <returns>Activity</returns>
        /// <exception cref="InvalidOperationException">Throws when activity does not exists</exception>
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
        /// Loads game state in session.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>Game state</returns>
        private HotPotatoState LoadState(RuntimeSession session)
        {
            if (session.GameState == null)
            {
                return new HotPotatoState();
            }

            var state = JsonSerializer.Deserialize<HotPotatoState>(session.GameState);

            if (state == null)
            {
                return new HotPotatoState();
            }

            return state;
        }

        /// <summary>
        /// Saves game state in session.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="state">Game state</param>
        private void SaveState(RuntimeSession session, HotPotatoState state)
        {
            var jsonString = JsonSerializer.Serialize(state);
            session.GameState = jsonString;
        }

        /// <summary>
        /// Returns a random participant from list alive participants
        /// </summary>
        /// <param name="state">Game state</param>
        /// <param name="excludeParticipantId">Participant id</param>
        /// <returns>Random particiapnt</returns>
        /// <exception cref="InvalidOperationException">Throws when participant cant be selected -- should not happen</exception>
        private Guid SelectRandomParticipant(
            HotPotatoState state,
            Guid? excludeParticipantId = null
        )
        {
            // Find all alive participants who has not activated potato
            var candidates = state
                .AliveParticipants.Where(p =>
                    (excludeParticipantId == null || p != excludeParticipantId)
                    && !state.PotatoInstances.Any(pi =>
                        pi.ParticipantId == p && pi.IsActive == true
                    )
                )
                .ToList();

            if (candidates.Count == 0)
            {
                throw new InvalidOperationException(
                    $"There should be at least one alive participants for exchange potato in session"
                );
            }

            return candidates[_random.Next(candidates.Count)];
        }

        /// <summary>
        /// Returns game state for host in session.
        /// </summary>
        /// <param name="state">Game state</param>
        /// <param name="session">Runtime session</param>
        /// <returns>Game state</returns>
        /// <exception cref="InvalidOperationException">Throws when game state is not right</exception>
        private object GetHostState(HotPotatoState state, RuntimeSession session)
        {
            if (state.Status == StatusPotato.GetReady)
            {
                return new
                {
                    status = "get_ready",
                    timerEnd = state.TimerEnd,
                    participants = state.Participants,
                    aliveParticipants = state.AliveParticipants,
                };
            }

            if (state.Status == StatusPotato.Results)
            {
                return new
                {
                    status = "results",
                    participants = state.Participants,
                    aliveParticipants = state.AliveParticipants,
                };
            }

            if (state.Status == StatusPotato.Answering)
            {
                return new
                {
                    status = "answering",
                    timerEnd = state.TimerEnd,
                    participants = state.Participants,
                    aliveParticipants = state.AliveParticipants,
                    activePotatoes = state
                        .PotatoInstances.Where(p => p.IsActive == true)
                        .Select(p => new
                        {
                            potatoId = p.PotatoId,
                            activity = GetActivity(session, p.ActivityId).ToActivityDto(),
                            participantId = p.ParticipantId,
                        }),
                };
            }

            throw new InvalidOperationException($"this should not have happenned ");
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
            HotPotatoState state,
            RuntimeSession session,
            Guid participantId
        )
        {
            var isEliminated = state.AliveParticipants.Any(p => p == participantId);

            if (!isEliminated)
            {
                return new
                {
                    status = "eliminated",
                    participants = state.Participants,
                    aliveParticipants = state.AliveParticipants,
                };
            }

            // Is participant last alive
            if (state.AliveParticipants.Count == 1)
            {
                var isWinner = state.AliveParticipants.Any(p => p == participantId);

                if (isWinner)
                {
                    return new
                    {
                        status = "winner",
                        participants = state.Participants,
                        aliveParticipants = state.AliveParticipants,
                    };
                }
            }

            if (state.Status == StatusPotato.GetReady)
            {
                return new
                {
                    status = "get_ready",
                    timerEnd = state.TimerEnd,
                    participants = state.Participants,
                    aliveParticipants = state.AliveParticipants,
                };
            }

            if (state.Status == StatusPotato.Results)
            {
                return new
                {
                    status = "results",
                    participants = state.Participants,
                    aliveParticipants = state.AliveParticipants,
                };
            }

            if (state.Status == StatusPotato.Answering)
            {
                var potato = state.PotatoInstances.First(pi => pi.ParticipantId == participantId);

                // Takes last answer and show feedback on this submitted answer
                var lastAnswer = session
                    .Answers.Where(a =>
                        a.OwnerId == participantId
                        && potato.PreviousActivityId == a.ActivityId
                        && a.Status == "Submitted"
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

                // Is his potato activated
                if (potato.IsActive)
                {
                    // Show him current activity and current answer
                    var currentAnswer = session
                        .Answers.Where(a =>
                            a.ActivityId == potato.ActivityId && a.OwnerId == potato.ParticipantId
                        )
                        .OrderByDescending(a => a.CreatedAt)
                        .FirstOrDefault();

                    if (currentAnswer == null)
                    {
                        throw new InvalidOperationException(
                            $"Participant with id {participantId} should have created answer"
                        );
                    }

                    return new
                    {
                        status = "answering",
                        timerEnd = state.TimerEnd,
                        participants = state.Participants,
                        aliveParticipants = state.AliveParticipants,
                        feedback = lastFeedback,
                        activity = GetActivity(session, potato.ActivityId)
                            .ToActivityWithoutSolutionDto(),
                        answer = currentAnswer.ToAnswerDto(),
                    };
                }
                else
                {
                    // He is safe and waiting for his activated potato
                    return new
                    {
                        status = "idle",
                        timerEnd = state.TimerEnd,
                        participants = state.Participants,
                        aliveParticipants = state.AliveParticipants,
                        feedback = lastFeedback,
                    };
                }
            }

            throw new InvalidOperationException($"this should not have happenned ");
        }
    }
}
