using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class TagDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateTagDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }

    public class ExerciseTagDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
