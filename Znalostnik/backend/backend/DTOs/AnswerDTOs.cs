using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class AnswerDto
    {
        public Guid Id { get; set; }
        public JsonDocument AnswerSubmit { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument AnswerEvaluation { get; set; } = JsonDocument.Parse("{}");
        public DateTime CreatedAt { get; set; }
        public Guid SubmissionId { get; set; }
        public Guid TaskId { get; set; }
    }

    public class CreateAnswerDto
    {
        public Guid SessionUserId { get; set; }
        public Guid TaskId { get; set; }
        public JsonDocument AnswerSubmit { get; set; } = JsonDocument.Parse("{}");
    }
}
