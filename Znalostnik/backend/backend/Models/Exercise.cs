using backend.Domain;
using backend.Models;
using System.Collections;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    public class Exercise
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public JsonDocument Settings { get; set; } = JsonDocument.Parse("{}"); 
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ExerciseTask> Tasks { get; set; } = new List<ExerciseTask>();
        public List<string> Tags { get; set; } = new List<string>();
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
    }

}
