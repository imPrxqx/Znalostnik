using backend.Models;
using Microsoft.AspNetCore.Mvc;

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
                Mode = exercise.Mode,
                Settings = exercise.Settings,
                CreatedAt = exercise.CreatedAt,
                UpdatedAt = exercise.UpdatedAt
            };
        }
    }
}
