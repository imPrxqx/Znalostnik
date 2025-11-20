namespace backend.Models
{
    public class SessionUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public string? UserId { get; set; }
        public User? User { get; set; }
        public string? DisplayUsername { get; set; }
        public TeamMember? TeamMember { get; set; }
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}
