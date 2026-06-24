using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class AnswerDto
    {
        public Guid Id { get; set; }
        public Guid SubmissionId { get; set; }
        public string Status { get; set; } = string.Empty;
        public JsonDocument Submit { get; set; } = JsonDocument.Parse("{}");
        public int CorrectPercentage { get; set; } = 0;
        public int Version { get; set; } = 0;
        public DateTime CreatedAt { get; set; }
        public Guid ActivityId { get; set; }
    }

    public class CreateAnswerDto
    {
        public Guid SessionUserId { get; set; }
        public Guid ActivityId { get; set; }
        public JsonDocument Submit { get; set; } = JsonDocument.Parse("{}");
    }
}
