using System.Text.Json;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.GameModes
{
    public class Classic : IGameMode
    {
        public string GameModeType => "classic";

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
            state.ScoringMode = session.GameSetting.ScoringMode;
            state.Participants = new List<Guid>(participantIds);
            state.AnsweringParticipants = new List<Guid>(participantIds);
            state.OrderedActivityIds = new List<Guid>(session.ActivityIds);
            state.Scores = participantIds
                .Select(id => new ParticipantScore { ParticipantId = id, Score = 0 })
                .ToList();

            state.ActivityId = state.OrderedActivityIds.First();
            state.Status = StatusClassic.GetReady;
            state.TimerEnd = DateTimeOffset.Now.AddSeconds(6);

            SaveState(session, state);

            var assignments = new List<ActivityAssignment>();

            foreach (var participant in state.Participants)
            {
                assignments.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant,
                        ActivityId = state.ActivityId,
                    }
                );
            }

            return assignments;
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

        public List<ActivityAssignment> OnAnswer(
            Guid participantId,
            RuntimeSession session,
            int correctPercentile
        )
        {
            var state = LoadState(session);

            if (state.Status != StatusClassic.Answering)
            {
                return new List<ActivityAssignment>();
            }

            var participant = state.Scores.FirstOrDefault(x => x.ParticipantId == participantId);
            var pendingScore = new ParticipantScore();
            var now = DateTime.UtcNow;
            int timePoints = 0;

            if (state.TimerEnd != null)
            {
                var timeLeft = (state.TimerEnd.Value - now).TotalSeconds;
                timePoints = (int)Math.Max(0, timeLeft);
            }

            int scoreToAdd;

            if (state.ScoringMode == "balanced")
            {
                var remaining = state.AnsweringParticipants.Count;
                scoreToAdd = (int)((remaining + timePoints) * (correctPercentile / 100.0));
            }
            else if (state.ScoringMode == "fast")
            {
                scoreToAdd = (int)(timePoints * timePoints * (correctPercentile / 100.0));
            }
            else
            {
                throw new InvalidOperationException($"Unknown scoring mode '{state.ScoringMode}'.");
            }

            pendingScore.ParticipantId = participantId;

            if (participant != null)
            {
                pendingScore.Score = scoreToAdd;
            }

            state.PendingScores.Add(pendingScore);
            state.AnsweringParticipants.Remove(participantId);

            SaveState(session, state);

            if (state.AnsweringParticipants.Count == 0)
            {
                OnRoundEnd(session);
            }

            return new List<ActivityAssignment>();
        }

        public List<ActivityAssignment> OnNextRoundStart(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.Status != StatusClassic.Results)
            {
                return new List<ActivityAssignment>();
            }

            var index = state.OrderedActivityIds.IndexOf(state.ActivityId);

            if (state.OrderedActivityIds.Count > index)
            {
                state.ActivityId = state.OrderedActivityIds[index + 1];
            }

            var assignments = new List<ActivityAssignment>();

            foreach (var participant in state.Participants)
            {
                assignments.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant,
                        ActivityId = state.ActivityId,
                    }
                );
            }

            state.AnsweringParticipants.AddRange(state.Participants);
            state.TimerEnd = DateTimeOffset.Now.AddSeconds(6);
            state.Status = StatusClassic.GetReady;
            SaveState(session, state);

            return assignments;
        }

        public List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.Status != StatusClassic.Results)
            {
                return new List<ActivityAssignment>();
            }

            var index = state.OrderedActivityIds.IndexOf(state.ActivityId);

            if (0 < index)
            {
                state.ActivityId = state.OrderedActivityIds[index - 1];
            }

            var assignments = new List<ActivityAssignment>();

            foreach (var participant in state.Participants)
            {
                assignments.Add(
                    new ActivityAssignment
                    {
                        ParticipantId = participant,
                        ActivityId = state.ActivityId,
                    }
                );
            }

            state.AnsweringParticipants.AddRange(state.Participants);
            state.TimerEnd = DateTimeOffset.Now.AddSeconds(6);
            state.Status = StatusClassic.GetReady;

            SaveState(session, state);

            return assignments;
        }

        public void OnRoundEnd(RuntimeSession session)
        {
            var state = LoadState(session);

            if (state.Status != StatusClassic.Answering)
            {
                return;
            }

            foreach (var score in state.PendingScores)
            {
                var scoreToApply = state.Scores.Find(p => p.ParticipantId == score.ParticipantId);

                if (scoreToApply != null)
                {
                    scoreToApply.Score += score.Score;
                }
            }

            state.Status = StatusClassic.Results;
            state.TimerEnd = null;
            state.PendingScores.Clear();
            state.AnsweringParticipants.Clear();
            SaveState(session, state);
        }

        public void End(RuntimeSession session) { }

        public Guid? GetParticipantActivityId(Guid participantId, RuntimeSession session)
        {
            var state = LoadState(session);

            var activityId = state.AnsweringParticipants.Contains(participantId);

            if (state.AnsweringParticipants.Contains(participantId))
            {
                return state.ActivityId;
            }

            return null;
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
                case StatusClassic.GetReady:
                    state.Status = StatusClassic.Answering;
                    state.TimerEnd = DateTimeOffset.Now.AddSeconds(state.TimerRound);
                    SaveState(session, state);
                    break;
                case StatusClassic.Answering:
                    OnRoundEnd(session);
                    break;
                case StatusClassic.Results:
                    OnNextRoundStart(session);
                    break;
                default:
                    state.TimerEnd = null;
                    break;
            }
        }

        private RuntimeActivity GetActivity(RuntimeSession session)
        {
            var state = LoadState(session);

            var activity = session.Activities.FirstOrDefault(a => a.Id == state.ActivityId);

            if (activity == null)
            {
                throw new InvalidOperationException(
                    $"Activity with id {state.ActivityId} not found in session {session.Id}"
                );
            }

            return activity;
        }

        private RuntimeAnswer GetActivityAnswer(RuntimeSession session, Guid participantId)
        {
            var state = LoadState(session);

            var answer = session
                .Answers.Where(a => a.ActivityId == state.ActivityId && a.OwnerId == participantId)
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefault();

            if (answer == null)
            {
                throw new InvalidOperationException(
                    $"Answer not found for participant with id {participantId}"
                );
            }

            return answer;
        }

        private ClassicState LoadState(RuntimeSession session)
        {
            if (session.GameState == null)
            {
                return new ClassicState();
            }

            var state = JsonSerializer.Deserialize<ClassicState>(session.GameState);

            if (state == null)
            {
                return new ClassicState();
            }

            return state;
        }

        private void SaveState(RuntimeSession session, ClassicState state)
        {
            var jsonString = JsonSerializer.Serialize(state);
            session.GameState = jsonString;
        }

        private object GetHostState(ClassicState state, RuntimeSession session)
        {
            if (state.Status == StatusClassic.GetReady)
            {
                return new
                {
                    status = "get_ready",
                    timerEnd = state.TimerEnd,
                    activityIndex = GetActivity(session).Order,
                    totalActivities = state.OrderedActivityIds.Count,
                };
            }

            if (state.Status == StatusClassic.Results)
            {
                return new
                {
                    status = "results",
                    leaderboard = state.Scores,
                    participants = state.Participants,
                    activityIndex = GetActivity(session).Order,
                    totalActivities = state.OrderedActivityIds.Count,
                };
            }

            if (state.Status == StatusClassic.Answering)
            {
                return new
                {
                    status = "answering",
                    timerEnd = state.TimerEnd,
                    activity = GetActivity(session).ToActivityDto(),
                    activityIndex = GetActivity(session).Order,
                    participants = state.Participants,
                    answeringParticipants = state.AnsweringParticipants,
                    answeredParticipants = state
                        .Participants.Except(state.AnsweringParticipants)
                        .Count(),
                    totalParticipants = state.Participants.Count,
                    totalActivities = state.OrderedActivityIds.Count,
                };
            }

            throw new InvalidOperationException($"this should not have happenned ");
        }

        private object GetParticipantState(
            ClassicState state,
            RuntimeSession session,
            Guid participantId
        )
        {
            if (state.Status == StatusClassic.GetReady)
            {
                return new
                {
                    status = "get_ready",
                    timerEnd = state.TimerEnd,
                    score = state.Scores.Find(p => p.ParticipantId == participantId),
                };
            }

            if (state.Status == StatusClassic.Results)
            {
                return new
                {
                    status = "results",
                    activity = GetActivity(session).ToActivityDto(),
                    answer = GetActivityAnswer(session, participantId).ToAnswerDto(),
                    score = state.Scores.Find(p => p.ParticipantId == participantId),
                };
            }

            var hasAnswered = !state.AnsweringParticipants.Contains(participantId);
            var isAnswering = state.AnsweringParticipants.Contains(participantId);

            if (state.Status == StatusClassic.Answering && isAnswering)
            {
                return new
                {
                    status = "answering",
                    activity = GetActivity(session).ToActivityWithoutSolutionDto(),
                    answer = GetActivityAnswer(session, participantId).ToAnswerDto(),
                    timerEnd = state.TimerEnd,
                    score = state.Scores.Find(p => p.ParticipantId == participantId),
                };
            }

            if (state.Status == StatusClassic.Answering && hasAnswered)
            {
                return new
                {
                    status = "waiting",
                    timerEnd = state.TimerEnd,
                    score = state.Scores.Find(p => p.ParticipantId == participantId),
                };
            }

            throw new InvalidOperationException($"this should not have happenned ");
        }
    }
}
