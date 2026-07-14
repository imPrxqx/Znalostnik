namespace backend.Models
{
    /// <summary>
    /// Represents created team in session
    /// </summary>
    public class Team
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public Guid SubmissionId { get; set; }
        public Submission Submission { get; set; } = null!;
        public ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
    }

    /// <summary>
    /// Represents created team in runtime session
    /// </summary>
    public class RuntimeTeam
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public List<Guid> TeamMemberIds { get; set; } = new();
    }
}
