using System.Collections;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    public class Exercise
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<Activity> Activities { get; set; } = new List<Activity>();
        public ICollection<ExerciseTag> ExerciseTags { get; set; } = new List<ExerciseTag>();
    }
}
