using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using backend.Models;

namespace backend.Models
{
    /// <summary>
    /// Represents a single activity within an exercise.
    /// Used to saving typy activity with content, solution and styles
    /// </summary>
    public class Activity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; } = default(int);

        [Column(TypeName = "jsonb")]
        public string Style { get; set; } = "{}";

        [Column(TypeName = "jsonb")]
        public string Content { get; set; } = "{}";

        [Column(TypeName = "jsonb")]
        public string Solution { get; set; } = "{}";
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
    }

    /// <summary>
    /// Represents a single activity within an exercise.
    /// Used to saving type activity with content, solution and styles for runtime session in memory.
    /// </summary>
    public class RuntimeActivity
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Style { get; set; } = "{}";
        public string Content { get; set; } = "{}";
        public string Solution { get; set; } = "{}";
    }
}
