using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    public class Answer
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public JsonDocument AnswerSubmit { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument AnswerEvaluation { get; set; } = JsonDocument.Parse("{}");
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid SubmissionId { get; set; }
        public Submission Submission { get; set; } = null!;
        public Guid TaskId { get; set; }
        public ExerciseTask Task { get; set; } = null!;
    }
}
