namespace backend.GameModes
{
    public class ClassicState
    {
        public int TimerRound { get; set; } = 30;
        public DateTimeOffset? TimerEnd { get; set; }
        public string ScoringMode { get; set; } = "balanced";
        public StatusClassic Status { get; set; }
        public Guid ActivityId { get; set; }
        public List<Guid> Participants { get; set; } = new List<Guid>();
        public List<Guid> AnsweringParticipants { get; set; } = new List<Guid>();
        public List<Guid> OrderedActivityIds { get; set; } = new List<Guid>();
        public List<ParticipantScore> Scores { get; set; } = new List<ParticipantScore>();
        public List<ParticipantScore> PendingScores { get; set; } = new List<ParticipantScore>();
    }

    public class ParticipantScore
    {
        public Guid ParticipantId { get; set; }
        public int Score { get; set; } = 0;
    }

    public enum StatusClassic
    {
        GetReady,
        Answering,
        Results,
    }
}
