namespace backend.Models
{
    public class SessionUser
    {

        public Guid Id { get; set; } = Guid.NewGuid();
        public string? UserName { get; set; }
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        public TeamMember? TeamMember { get; set; }

    }
}
