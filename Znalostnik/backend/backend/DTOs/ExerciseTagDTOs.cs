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
        public string Tag { get; set; } = string.Empty;
    }

    public class CreateExerciseTagDto
    {
        public string Tag { get; set; } = string.Empty;
    }
}
