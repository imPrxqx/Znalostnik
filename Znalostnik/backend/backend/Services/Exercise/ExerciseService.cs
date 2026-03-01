using System;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using backend.Utils;
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

        public async Task<Result<ExerciseDto>> GetByIdAsync(UserDto user, Guid exerciseId)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<ExerciseDto>.Failure(Errors.NotFound);
            }

            return Result<ExerciseDto>.Success(exercise.ToExerciseDto());
        }

        public async Task<Result<IEnumerable<ExerciseDto>>> GetAllUserExercisesAsync(
            UserDto user,
            int page,
            int pageSize
        )
        {
            var exercises = await _exerciseRepository.GetAllUserExercisesAsync(
                user.Id,
                page,
                pageSize
            );

            return Result<IEnumerable<ExerciseDto>>.Success(
                exercises.Select(e => e.ToExerciseDto())
            );
        }

        public async Task<Result<IEnumerable<ExerciseDto>>> GetAllUserExercisesByTagsAsync(
            UserDto user,
            string[] tags,
            int page,
            int pageSize
        )
        {
            var exercises = await _exerciseRepository.GetAllUserExercisesByTagsAsync(
                user.Id,
                tags,
                page,
                pageSize
            );

            return Result<IEnumerable<ExerciseDto>>.Success(
                exercises.Select(e => e.ToExerciseDto())
            );
        }

        public async Task<Result<ExerciseDto>> CreateAsync(UserDto user, CreateExerciseDto dto)
        {
            var exercise = new Exercise
            {
                Title = dto.Title,
                Mode = dto.Mode,
                Settings = dto.Settings,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _exerciseRepository.AddAsync(exercise);
            return Result<ExerciseDto>.Success(exercise.ToExerciseDto());
        }

        public async Task<Result> UpdateAsync(UserDto user, Guid exerciseId, UpdateExerciseDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<ExerciseDto>.Failure(Errors.NotFound);
            }

            exercise.Title = dto.Title;
            exercise.Mode = dto.Mode;
            exercise.Settings = dto.Settings;
            exercise.UpdatedAt = DateTime.UtcNow;

            await _exerciseRepository.UpdateAsync(exercise);
            return Result.Success();
        }

        public async Task<Result> DeleteAsync(UserDto user, Guid exerciseId)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<ExerciseDto>.Failure(Errors.NotFound);
            }

            await _exerciseRepository.DeleteAsync(exerciseId);
            return Result.Success();
        }
    }
}
