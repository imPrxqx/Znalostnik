namespace backend.Models
{
    public class Team
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string TeamName { get; set; } = string.Empty;
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
