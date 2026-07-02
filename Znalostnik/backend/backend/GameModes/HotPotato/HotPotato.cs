using System.Diagnostics;
using System.Text.Json;
using backend.Algorithms;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Routing.Matching;

namespace backend.GameModes
{
    public enum StatusPotato
    {
        GetReady,
        Answering,
        Results,
    }

    public class HotPotato : IGameMode
    {
        public string GameModeType => "hotPotato";

        private Random _random = new Random();
        private readonly ISelectionAlgorithmResolver _algorithms;
        private readonly int potatoesPerParticipants = 5;

        public HotPotato(ISelectionAlgorithmResolver algorithms)
        {
            _algorithms = algorithms;
        }

        public Result ValidateStart(RuntimeSession session, List<Guid> participantIds)
        {
            if (participantIds.Count < 2)
            {
                return Result.Failure(Errors.NotEnoughtParticipants);
            }

            return Result.Success();
        }

        public List<ActivityAssignment> Start(RuntimeSession session, List<Guid> participantIds)
        {
            var state = LoadState(session);

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

            foreach (var participantId in state.AliveParticipants)
            {
                var participantState = state.ParticipantsState.First(p => p.Id == participantId);
                var activity = algorithm.SelectNextActivity(activities, participantState);

                state.PotatoInstances.Add(
                    new PotatoInstance
                    {
                        CurrentParticipantId = participantId,
                        CurrentActivityId = activity.Id,
                    }
                );
            }

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

            var assignments = new List<ActivityAssignment>();

            foreach (var participant in activePotatoes)
            {
                assignments.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant.CurrentParticipantId,
                        ActivityId = participant.CurrentActivityId,
                    }
                );
            }

            return assignments;
        }

        public void End(RuntimeSession session) { }

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
                p.CurrentParticipantId == participantId
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

            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var participantState = state.ParticipantsState.First(p =>
                p.Id == potato.CurrentParticipantId
            );
            var currentActivity = session.Activities.First(a => a.Id == potato.CurrentActivityId);
            algorithm.UpdatePlayerState(participantState, currentActivity, correctPercentile);
            potato.PreviousActivityId = potato.CurrentActivityId;
            ;
            potato.CurrentActivityId = algorithm
                .SelectNextActivity(session.Activities, participantState)
                .Id;

            PotatoInstance activePotato;

            if (correctPercentile == 100)
            {
                var newParticipantId = SelectRandomParticipant(state, participantId);
                activePotato = state.PotatoInstances.First(pi =>
                    pi.CurrentParticipantId == newParticipantId
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

            var assignments = new List<ActivityAssignment>();

            var newActivityAssignemnt = new ActivityAssignment
            {
                ParticipantId = activePotato.CurrentParticipantId,
                ActivityId = activePotato.CurrentActivityId,
            };

            assignments.Add(newActivityAssignemnt);

            return assignments;
        }

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

            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var activities = session.Activities;

            foreach (var participantId in state.AliveParticipants)
            {
                var participantState = state.ParticipantsState.First(p => p.Id == participantId);
                var activity = algorithm.SelectNextActivity(activities, participantState);

                state.PotatoInstances.Add(
                    new PotatoInstance
                    {
                        CurrentParticipantId = participantId,
                        CurrentActivityId = activity.Id,
                    }
                );
            }

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

            var assignments = new List<ActivityAssignment>();

            foreach (var participant in activePotatoes)
            {
                assignments.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant.CurrentParticipantId,
                        ActivityId = participant.CurrentActivityId,
                    }
                );
            }

            return assignments;
        }

        public List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session)
        {
            return new List<ActivityAssignment>();
        }

        public void OnRoundEnd(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.Status != StatusPotato.Answering)
            {
                return;
            }

            foreach (var potato in state.PotatoInstances)
            {
                if (potato.IsActive)
                {
                    state.AliveParticipants.Remove(potato.CurrentParticipantId);
                }
            }

            state.PotatoInstances.Clear();
            state.TimerEnd = null;
            state.Status = StatusPotato.Results;

            SaveState(session, state);
        }

        public void ProcessStateTransition(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.TimerEnd == null || state.TimerEnd > DateTime.UtcNow)
            {
                return;
            }

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

        public Guid? GetParticipantActivityId(Guid participantId, RuntimeSession session)
        {
            var state = LoadState(session);

            var potato = state.PotatoInstances.FirstOrDefault(pi =>
                pi.CurrentParticipantId == participantId
            );

            if (potato == null)
            {
                return null;
            }

            return potato.CurrentActivityId;
        }

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

        private void SaveState(RuntimeSession session, HotPotatoState state)
        {
            var jsonString = JsonSerializer.Serialize(state);
            session.GameState = jsonString;
        }

        private Guid SelectRandomParticipant(
            HotPotatoState state,
            Guid? excludeParticipantId = null
        )
        {
            var candidates = state
                .AliveParticipants.Where(p =>
                    (excludeParticipantId == null || p != excludeParticipantId)
                    && !state.PotatoInstances.Any(pi =>
                        pi.CurrentParticipantId == p && pi.IsActive == true
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
                    activePotatoes = state.PotatoInstances.Select(p => new
                    {
                        potatoId = p.PotatoId,
                        activity = GetActivity(session, p.CurrentActivityId).ToActivityDto(),
                        currentParticipantId = p.CurrentParticipantId,
                    }),
                };
            }

            throw new InvalidOperationException($"this should not have happenned ");
        }

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
                var potato = state.PotatoInstances.First(pi =>
                    pi.CurrentParticipantId == participantId
                );

                var lastAnswer = session
                    .Answers.Where(a =>
                        a.OwnerId == participantId && potato.PreviousActivityId == a.ActivityId
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

                if (potato.IsActive)
                {
                    var currentAnswer = session
                        .Answers.Where(a => a.ActivityId == potato.CurrentActivityId)
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
                        activity = GetActivity(session, potato.CurrentActivityId)
                            .ToActivityWithoutSolutionDto(),
                        answer = currentAnswer.ToAnswerDto(),
                    };
                }
                else
                {
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
