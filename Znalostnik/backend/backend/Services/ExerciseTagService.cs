using System;
using System.Threading.Tasks;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ExerciseTagService : IExerciseTagService
    {
        private readonly IExerciseTagRepository _exerciseTagRepository;
        private readonly IExerciseRepository _exerciseRepository;

        public ExerciseTagService(
            IExerciseTagRepository exerciseTagRepository,
            IExerciseRepository exerciseRepository
        )
        {
            _exerciseTagRepository = exerciseTagRepository;
            _exerciseRepository = exerciseRepository;
        }

        public async Task<IEnumerable<ExerciseTagDto>> GetTagsAsync(UserDto user, Guid exerciseId)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Enumerable.Empty<ExerciseTagDto>();
            }

            var exerciseTags = await _exerciseTagRepository.GetAllTagsByExerciseIdAsync(exerciseId);

            return exerciseTags.Select(t => t.ToExerciseTagDto());
        }

        public async Task<ExerciseTagDto?> CreateTagAsync(UserDto user, CreateExerciseTagDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(dto.ExerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return null;
            }

            var exerciseTag = new ExerciseTag { ExerciseId = dto.ExerciseId, Tag = dto.Tag };

            await _exerciseTagRepository.AddAsync(exerciseTag);
            return exerciseTag.ToExerciseTagDto();
        }

        public async Task<bool> UpdateTagAsync(UserDto user, UpdateExerciseTagDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(dto.ExerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return false;
            }

            var exerciseTag = await _exerciseTagRepository.GetExerciseTagByIdAsync(
                dto.ExerciseId,
                dto.Tag
            );

            if (exerciseTag == null)
            {
                return false;
            }

            exerciseTag.ExerciseId = dto.ExerciseId;
            exerciseTag.Tag = dto.Tag;

            await _exerciseTagRepository.UpdateAsync(exerciseTag);
            return true;
        }

        public async Task<bool> DeleteTagAsync(UserDto user, DeleteExerciseTagDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(dto.ExerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return false;
            }

            var exerciseTag = await _exerciseTagRepository.GetExerciseTagByIdAsync(
                dto.ExerciseId,
                dto.Tag
            );

            if (exerciseTag == null)
            {
                return false;
            }

            await _exerciseTagRepository.DeleteAsync(dto.ExerciseId, dto.Tag);
            return true;
        }
    }
}
