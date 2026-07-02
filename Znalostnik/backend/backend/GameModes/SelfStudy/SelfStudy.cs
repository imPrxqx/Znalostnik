using System.Text.Json;
using backend.Algorithms;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.GameModes
{
    public class SelfStudy : IGameMode
    {
        public string GameModeType => "selfStudy";

        private readonly ISelectionAlgorithmResolver _algorithms;

        public SelfStudy(ISelectionAlgorithmResolver algorithms)
        {
            _algorithms = algorithms;
        }

        public Result ValidateStart(RuntimeSession session, List<Guid> participantIds)
        {
            if (participantIds.Count == 0)
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
            state.Participants = new List<Guid>(participantIds);
            state.AvailableActivities = new List<Guid>(session.ActivityIds);
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

            var newParticipants = new List<ActivityAssignment>();

            foreach (var participant in state.ActivityInstances)
            {
                newParticipants.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant.ParticipantId,
                        ActivityId = participant.ActivityId,
                    }
                );
            }

            return newParticipants;
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

        public List<ActivityAssignment> OnAnswer(
            Guid participantId,
            RuntimeSession session,
            int correctPercentile
        )
        {
            var state = LoadState(session);

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

            instance.PreviousActivityId = instance.ActivityId;

            var participantState = state.ParticipantsState.First(p => p.Id == participantId);
            var algorithm = _algorithms.Resolve(state.SelectionAlgorithm);
            var currentActivity = session.Activities.First(a => a.Id == instance.ActivityId);
            algorithm.UpdateParticipantState(participantState, currentActivity, correctPercentile);
            var next = algorithm.SelectNextActivity(session.Activities, participantState);
            instance.ActivityId = next.Id;
            SaveState(session, state);

            var assignments = new List<ActivityAssignment>();

            var newActivityAssignemnt = new ActivityAssignment
            {
                ParticipantId = participantId,
                ActivityId = next.Id,
            };

            assignments.Add(newActivityAssignemnt);
            return assignments;
        }

        public void End(RuntimeSession session) { }

        public List<ActivityAssignment> OnNextRoundStart(RuntimeSession session)
        {
            return new List<ActivityAssignment>();
        }

        public List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session)
        {
            return new List<ActivityAssignment>();
        }

        public void OnRoundEnd(RuntimeSession session) { }

        public void ProcessStateTransition(RuntimeSession session) { }

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

        private void SaveState(RuntimeSession session, SelfStudyState state)
        {
            var jsonString = JsonSerializer.Serialize(state);
            session.GameState = jsonString;
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
