namespace backend.Models
{
    /// <summary>
    /// Represents a session user in session
    /// </summary>
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

    /// <summary>
    /// Represents a session user joined in active session
    /// </summary>
    public class RuntimeSessionUser
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }
}
