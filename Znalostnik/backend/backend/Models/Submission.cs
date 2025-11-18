using System.Text.Json;

namespace backend.Models
{
    public class Submission
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public Guid? TeamId { get; set; }
        public Team? Team { get; set; }
        public Guid? SessionUserId { get; set; }
        public SessionUser? SessionUser { get; set; }
        public JsonDocument Data { get; set; } = JsonDocument.Parse("{}");
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
