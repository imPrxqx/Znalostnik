namespace backend.GameModes
{
    /// <summary>
    /// Structure of game mode classic -- used for saving game state.
    /// </summary>
    public class ClassicState
    {
        /// <summary>
        /// Defined duration of time when round ends
        /// </summary>
        public int TimerRound { get; set; } = 30;

        /// <summary>
        /// Time when round should ends
        /// </summary>
        public DateTimeOffset? TimerEnd { get; set; }

        /// <summary>
        /// Scoring mode for calculating points for participants
        /// </summary>
        public string ScoringMode { get; set; } = "balanced";

        /// <summary>
        /// Status of game state
        /// </summary>
        public StatusClassic Status { get; set; }

        /// <summary>
        /// Current activity id displayed for participants
        /// </summary>
        public Guid ActivityId { get; set; }

        /// <summary>
        /// List of participants which are participating in game mode
        /// </summary>
        public List<Guid> Participants { get; set; } = new List<Guid>();

        /// <summary>
        /// List of participants which are still answering to current activity
        /// </summary>
        public List<Guid> AnsweringParticipants { get; set; } = new List<Guid>();

        /// <summary>
        /// List of ordered activities what should used for next or previous activities
        /// </summary>
        public List<Guid> OrderedActivityIds { get; set; } = new List<Guid>();

        /// <summary>
        /// List of actual scores of participant in game mode
        /// </summary>
        public List<ParticipantScore> Scores { get; set; } = new List<ParticipantScore>();

        /// <summary>
        /// List of pending scores of participant to apply in game mode
        /// </summary>
        public List<ParticipantScore> PendingScores { get; set; } = new List<ParticipantScore>();
    }

    /// <summary>
    /// Structure of participant score used in game mode
    /// </summary>
    public class ParticipantScore
    {
        /// <summary>
        /// Participant id
        /// </summary>
        public Guid ParticipantId { get; set; }

        /// <summary>
        /// Particiapnt actual score
        /// </summary>
        public int Score { get; set; } = 0;
    }

    /// <summary>
    /// Defined states used in game mode classic
    /// </summary>
    public enum StatusClassic
    {
        /// <summary>
        /// When activity is being ready for participants
        /// </summary>
        GetReady,

        /// <summary>
        /// Participants are answering on current activity
        /// </summary>
        Answering,

        /// <summary>
        /// Results of answer on activity
        /// </summary>
        Results,
    }
}
