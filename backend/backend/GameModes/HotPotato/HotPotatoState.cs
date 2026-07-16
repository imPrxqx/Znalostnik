using backend.Algorithms;

namespace backend.GameModes
{
    public class HotPotatoState
    {
        public int TimerRound { get; set; } = 0;
        public string SelectionAlgorithm { get; set; } = "random";
        public StatusPotato Status { get; set; } = StatusPotato.GetReady;
        public DateTimeOffset? TimerEnd { get; set; }
        public List<PotatoInstance> PotatoInstances { get; set; } = new List<PotatoInstance>();
        public List<AlgorithmsState> ParticipantsState { get; set; } = new List<AlgorithmsState>();
        public List<Guid> Participants { get; set; } = new List<Guid>();
        public List<Guid> AvailableActivities { get; set; } = new List<Guid>();
        public List<Guid> AliveParticipants { get; set; } = new List<Guid>();
    }

    /// <summary>
    /// Structure of hot potato used in game mode
    /// </summary>
    public class PotatoInstance
    {
        /// <summary>
        /// Identifier of activity instance
        /// </summary>
        public Guid PotatoId { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Is potato active on current participant
        /// </summary>
        public bool IsActive { get; set; } = false;

        /// <summary>
        /// Current holder of this potato
        /// </summary>
        public Guid ParticipantId { get; set; }

        /// <summary>
        /// Current activity id
        /// </summary>
        public Guid ActivityId { get; set; }

        /// <summary>
        /// Previous activity id -- if potato is newly active, this will be null for reseting feedback
        /// </summary>
        public Guid? PreviousActivityId { get; set; } = null;
    }

    /// <summary>
    /// Defined states used in game mode hot potato
    /// </summary>
    public enum StatusPotato
    {
        /// <summary>
        /// When activity is being ready for participants
        /// </summary>
        GetReady,

        /// <summary>
        /// Participants are answering on active potatoes
        /// </summary>
        Answering,

        /// <summary>
        /// Results of exploded potatoes
        /// </summary>
        Results,
    }
}
