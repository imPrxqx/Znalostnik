using backend.Algorithms;

namespace backend.GameModes
{
    public class SelfStudyState
    {
        public int TimerRound { get; set; } = 0;
        public string SelectionAlgorithm { get; set; } = "random";
        public List<Guid> Participants { get; set; } = new List<Guid>();
        public List<PlayerSelfStudyScore> Scores { get; set; } = new List<PlayerSelfStudyScore>();
        public List<AlgorithmsState> ParticipantsState { get; set; } = new List<AlgorithmsState>();

        public List<ActivityInstance> ActivityInstances { get; set; } =
            new List<ActivityInstance>();
        public List<Guid> AvailableActivities { get; set; } = new List<Guid>();
    }

    public class PlayerSelfStudyScore
    {
        public Guid ParticipantId { get; set; }
        public double CorrectCount { get; set; } = 0;
        public int CompletedCount { get; set; } = 0;
    }

    public class ActivityInstance
    {
        public Guid ActivityInstanceId { get; set; }
        public Guid CurrentParticipantId { get; set; }
        public Guid? PreviousActivityId { get; set; }
        public Guid CurrentActivityId { get; set; }
    }
}
