namespace backend.Models
{
    public class Session
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = false;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? AccessCode { get; set; }
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public string CreatedByUserId { get; set; } = string.Empty;
        public User CreatedByUser { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Team> Teams { get; set; } = new List<Team>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();
    }
}
