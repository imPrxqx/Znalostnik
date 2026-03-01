using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class CreateExerciseTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
    }

    public class UpdateExerciseTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
    }

    public class ExerciseTaskDto
    {
        public Guid Id { get; set; }
        public Guid ExerciseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
    }
}
