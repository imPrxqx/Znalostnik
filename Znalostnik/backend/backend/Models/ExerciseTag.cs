using System.Collections;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend.Models
{
    public class ExerciseTag
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public string Tag { get; set; } = string.Empty;
    }

}
