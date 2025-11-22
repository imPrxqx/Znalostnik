using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class ExerciseTagDto
    {
        public Guid ExerciseId { get; set; }
        public string Tag { get; set; } = string.Empty;
    }

    public class UpdateExerciseTagDto
    {
        public Guid ExerciseId { get; set; }
        public string Tag { get; set; } = string.Empty;
    }

    public class CreateExerciseTagDto
    {
        public Guid ExerciseId { get; set; }
        public string Tag { get; set; } = string.Empty;
    }

    public class DeleteExerciseTagDto
    {
        public Guid ExerciseId { get; set; }
        public string Tag { get; set; } = string.Empty;
    }
}
