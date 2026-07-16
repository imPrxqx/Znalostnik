namespace backend.Models
{
    /// <summary>
    /// Represents exercise tag on selected exercise
    /// Used for filtering exercises
    /// </summary>
    public class ExerciseTag
    {
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public Guid TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}
