using backend.Domain;
using System.Text.Json;

namespace backend.Models
{
    public class Submission
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SessionId { get; set; }
        public Session Session { get; set; } = null!;
        public string? UserId { get; set; }
        public User User { get; set; } = null!;
        public JsonDocument Data { get; set; } = JsonDocument.Parse("{}");
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();

    }
}
