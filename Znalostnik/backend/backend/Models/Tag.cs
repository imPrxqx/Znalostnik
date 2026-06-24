namespace backend.Models
{
    public class Tag
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;

        public ICollection<ExerciseTag> ExerciseTags { get; set; } = new List<ExerciseTag>();
    }
}
