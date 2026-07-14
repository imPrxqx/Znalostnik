using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    /// <summary>
    /// Represents a submitted answer for selected activity
    /// Stores submitted data, evalution result
    /// </summary>
    public class Answer
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column(TypeName = "jsonb")]
        public string Submit { get; set; } = "{}";

        // Correctnes of submitted answer
        public int CorrectPercentage { get; set; }

        // Is answer submitted, empty or drafted
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid SubmissionId { get; set; }
        public Submission Submission { get; set; } = null!;
        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; } = null!;
    }

    /// <summary>
    /// Represents a submitted answer for selected activity
    /// Stores submitted data, evaluation result in runtime session in memory
    /// </summary>
    public class RuntimeAnswer
    {
        public Guid Id { get; } = Guid.NewGuid();
        public Guid OwnerId { get; set; }
        public Guid ActivityId { get; set; }

        // Team or individual
        public string OwnerType { get; set; } = string.Empty;

        // Is answer submitted, empty or drafted
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Submit { get; set; } = "{}";

        // How many times was answer changed
        public int Version { get; set; } = 0;

        // Correctnes of submitted answer
        public int CorrectPercentage { get; set; }
    }
}
