namespace backend.Models
{
    public class ExerciseTag
    {
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public Guid TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
