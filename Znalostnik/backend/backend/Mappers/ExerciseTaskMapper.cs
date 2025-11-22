using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public static class ExerciseTaskMapper
    {
        public static ExerciseTaskDto ToExerciseTaskDto(this ExerciseTask task)
        {
            return new ExerciseTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Type = task.Type,
                Order = task.Order,
                Content = task.Content,
                ExerciseId = task.ExerciseId,
            };
        }
    }
}
