using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    public class Answer
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column(TypeName = "jsonb")]
        public string Submit { get; set; } = "{}";
        public int CorrectPercentage { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid SubmissionId { get; set; }
        public Submission Submission { get; set; } = null!;
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; } = null!;
    }

    public class RuntimeAnswer
    {
        public Guid Id { get; } = Guid.NewGuid();
        public Guid OwnerId { get; set; }
        public Guid ActivityId { get; set; }
        public string OwnerType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Submit { get; set; } = "{}";
        public int Version { get; set; } = 0;
        public int CorrectPercentage { get; set; }
    }
}
