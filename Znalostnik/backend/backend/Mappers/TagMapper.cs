using System.Text.Json;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public static class TagMapper
    {
        public static TagDto ToTagDto(this Tag tag)
        {
            return new TagDto { Id = tag.Id, Name = tag.Name };
        }

        public static ExerciseTagDto ToExerciseTagDto(this ExerciseTag exerciseTag)
        {
            return new ExerciseTagDto { Id = exerciseTag.TagId, Name = exerciseTag.Tag.Name };
        }
    }
}
