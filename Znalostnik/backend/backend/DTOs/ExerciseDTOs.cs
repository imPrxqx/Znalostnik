using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class CreateExerciseDto
    {
        public string Title { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public JsonDocument Settings { get; set; } = JsonDocument.Parse("{}");
    }

    public class UpdateExerciseDto
    {
        public string Title { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public JsonDocument Settings { get; set; } = JsonDocument.Parse("{}");
    }

    public class ExerciseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public JsonDocument Settings { get; set; } = JsonDocument.Parse("{}");
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
