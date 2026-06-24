using backend.Models;

namespace backend.DTOs
{
    public static class ExerciseMapper
    {
        public static ExerciseDto ToExerciseDto(this Exercise exercise)
        {
            return new ExerciseDto
            {
                Id = exercise.Id,
                Title = exercise.Title,
                Activities = exercise
                    .Activities.OrderBy(a => a.Order)
                    .Select(a => a.ToActivityDto())
                    .ToList(),
                Tags = exercise.ExerciseTags.Select(et => et.ToExerciseTagDto()).ToList(),
                CreatedAt = exercise.CreatedAt,
                UpdatedAt = exercise.UpdatedAt,
            };
        }
    }
}
