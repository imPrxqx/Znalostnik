using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class SessionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid ExerciseId { get; set; }
    }

    public class CreateSessionDto
    {
        public string Title { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public string? AccessCode { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid ExerciseId { get; set; }
    }

    public class UpdateSessionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
