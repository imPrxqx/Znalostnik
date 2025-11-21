using System;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly IExerciseRepository _exerciseRepository;

        public ExerciseService(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<ExerciseDto?> GetByIdAsync(UserDto user, Guid id)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(id);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return null;
            }

            return exercise.ToExerciseDto();
        }

        public async Task<IEnumerable<ExerciseDto>> GetAllUserExercisesAsync(
            UserDto user,
            int page = 1,
            int pageSize = 20
        )
        {
            var exercises = await _exerciseRepository.GetAllUserExercisesAsync(
                user.Id,
                page,
                pageSize
            );

            return exercises.Select(e => e.ToExerciseDto());
        }

        public async Task<IEnumerable<ExerciseDto>> GetAllUserExercisesByTagsAsync(
            UserDto user,
            string[] tags,
            int page = 1,
            int pageSize = 20
        )
        {
            var exercises = await _exerciseRepository.GetAllUserExercisesByTagsAsync(
                user.Id,
                tags,
                page,
                pageSize
            );

            return exercises.Select(e => e.ToExerciseDto());
        }

        public async Task<ExerciseDto> CreateAsync(UserDto user, CreateExerciseDto dto)
        {
            var exercise = new Exercise
            {
                Title = dto.Title,
                Mode = dto.Mode,
                Settings = dto.Settings,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _exerciseRepository.AddAsync(exercise);
            return exercise.ToExerciseDto();
        }

        public async Task<bool> UpdateAsync(UserDto user, UpdateExerciseDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(dto.Id);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return false;
            }

            exercise.Title = dto.Title;
            exercise.Mode = dto.Mode;
            exercise.Settings = dto.Settings;
            exercise.UpdatedAt = DateTime.UtcNow;

            await _exerciseRepository.UpdateAsync(exercise);
            return true;
        }

        public async Task<bool> DeleteAsync(UserDto user, Guid id)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(id);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return false;
            }

            await _exerciseRepository.DeleteAsync(id);
            return true;
        }
    }
}
