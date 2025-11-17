namespace backend.Models
{
    public class Team
    {

        public Guid Id { get; set; } = Guid.NewGuid();
        public string TeamName { get; set; } = string.Empty;
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public Guid SubmissionId { get; set; }
        public Session Submission { get; set; } = null!;
        public ICollection<TeamMember> Members { get; set; } = new List<TeamMember>();

    }
}
