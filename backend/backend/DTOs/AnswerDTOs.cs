using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class AnswerDto
    {
        public Guid Id { get; set; }
        public Guid SubmissionId { get; set; }
        public string Status { get; set; } = string.Empty;

        // Submitted answer on activity
        public JsonDocument Submit { get; set; } = JsonDocument.Parse("{}");

        // Correctnes on answe 0 - 100
        public int CorrectPercentage { get; set; } = 0;
        public int Version { get; set; } = 0;
        public DateTime CreatedAt { get; set; }
        public Guid ActivityId { get; set; }
    }

    public class CreateAnswerDto
    {
        [Required]
        public Guid SessionUserId { get; set; }

        [Required]
        public Guid ActivityId { get; set; }

        [Required]
        public JsonDocument Submit { get; set; } = JsonDocument.Parse("{}");
    }
}
