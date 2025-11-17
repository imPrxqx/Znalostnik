using System.Text.Json;
using backend.Models;

namespace backend.Models
{
    public class ExerciseTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; } = default(int);
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
    }
}
