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

    public class PotatoInstance
    {
        public Guid PotatoId { get; set; } = Guid.NewGuid();
        public bool IsActive { get; set; } = false;
        public Guid CurrentParticipantId { get; set; }
        public Guid CurrentActivityId { get; set; }
        public Guid? PreviousActivityId { get; set; } = null;
    }
}
