using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class CreateExerciseDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
    }

    public class UpdateExerciseDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public List<CreateActivityDTO> Activities { get; set; } = new();
    }

    public class ExerciseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<ActivityDTO> Activities { get; set; } = new();
        public List<ExerciseTagDto> Tags { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
