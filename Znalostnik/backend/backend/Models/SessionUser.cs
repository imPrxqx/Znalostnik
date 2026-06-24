namespace backend.Models
{
    public class SessionUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public string? UserId { get; set; }
        public User? User { get; set; }
        public string Username { get; set; } = string.Empty;
        public TeamMember? TeamMember { get; set; } = null;
        public Submission Submission { get; set; } = null!;
    }

    public class RuntimeSessionUser
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
    }
}
