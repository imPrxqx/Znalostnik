using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public static class ExerciseTagMapper
    {
        public static ExerciseTagDto ToExerciseTagDto(this ExerciseTag tag)
        {
            return new ExerciseTagDto { ExerciseId = tag.ExerciseId, Tag = tag.Tag };
        }
    }
}
