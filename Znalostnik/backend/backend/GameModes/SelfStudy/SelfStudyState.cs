using backend.Algorithms;

namespace backend.GameModes
{
    /// <summary>
    /// Structure of game mode self study -- used for saving game state.
    /// </summary>
    public class SelfStudyState
    {
        /// <summary>
        /// Selected adaptive algorithm for selecting participant next activities
        /// </summary>
        public string SelectionAlgorithm { get; set; } = "random";

        /// <summary>
        /// List of participants which are participating in game mode
        /// </summary>
        public List<Guid> Participants { get; set; } = new List<Guid>();

        /// <summary>
        /// List of actual scores of participant in game mode
        /// </summary>
        public List<ParticipantSelfStudyScore> Scores { get; set; } =
            new List<ParticipantSelfStudyScore>();

        /// <summary>
        /// Current algorithm state for selecting next activites
        /// </summary>
        public List<AlgorithmsState> ParticipantsState { get; set; } = new List<AlgorithmsState>();

        /// <summary>
        /// List of participants current activites which are solving
        /// </summary>
        public List<ActivityInstance> ActivityInstances { get; set; } =
            new List<ActivityInstance>();
    }

    /// <summary>
    /// Structure of participant score used in game mode
    /// </summary>
    public class ParticipantSelfStudyScore
    {
        /// <summary>
        /// Participant id
        /// </summary>
        public Guid ParticipantId { get; set; }

        /// <summary>
        /// Count of already correcly solved activites (based on correct percentile)
        /// </summary>
        public double CorrectCount { get; set; } = 0;

        /// <summary>
        /// Count of already solved activites - wrong or correct
        /// </summary>
        public int CompletedCount { get; set; } = 0;
    }

    /// <summary>
    /// Srtucture of participant current activity
    /// </summary>
    public class ActivityInstance
    {
        /// <summary>
        /// Identifier of activity instance
        /// </summary>
        public Guid ActivityInstanceId { get; set; }

        /// <summary>
        /// Participant id
        /// </summary>
        public Guid ParticipantId { get; set; }

        /// <summary>
        /// Previous activity id
        /// </summary>
        public Guid? PreviousActivityId { get; set; }

        /// <summary>
        /// Current activit id
        /// </summary>
        public Guid ActivityId { get; set; }
    }
}
