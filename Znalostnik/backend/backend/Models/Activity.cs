using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using backend.Models;

namespace backend.Models
{
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
