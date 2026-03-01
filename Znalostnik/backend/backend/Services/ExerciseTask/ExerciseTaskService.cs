using System;
using System.Text.Json;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.Services
{
    public class ExerciseTaskService : IExerciseTaskService
    {
        private readonly IExerciseRepository _exerciseRepository;
        private readonly IExerciseTaskRepository _exerciseTaskRepository;

        public ExerciseTaskService(
            IExerciseRepository exerciseRepository,
            IExerciseTaskRepository exerciseTaskRepository
        )
        {
            _exerciseRepository = exerciseRepository;
            _exerciseTaskRepository = exerciseTaskRepository;
        }

        public async Task<Result<IEnumerable<ExerciseTaskDto>>> GetExerciseTasksAsync(
            UserDto user,
            Guid exerciseId
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<IEnumerable<ExerciseTaskDto>>.Failure(Errors.NotFound);
            }

            var exerciseTasks = await _exerciseTaskRepository.GetByExerciseIdAsync(exerciseId);

            return Result<IEnumerable<ExerciseTaskDto>>.Success(
                exerciseTasks.Select(t => t.ToExerciseTaskDto())
            );
        }

        public async Task<Result<ExerciseTaskDto>> GetExerciseTaskAsync(
            UserDto user,
            Guid exerciseId,
            Guid taskId
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<ExerciseTaskDto>.Failure(Errors.NotFound);
            }

            var exerciseTask = await _exerciseTaskRepository.GetByIdAsync(taskId);

            if (exerciseTask == null || exerciseTask.ExerciseId != exercise.Id)
            {
                return Result<ExerciseTaskDto>.Failure(Errors.NotFound);
            }

            return Result<ExerciseTaskDto>.Success(exerciseTask.ToExerciseTaskDto());
        }

        public async Task<Result<ExerciseTaskDto>> CreateAsync(
            UserDto user,
            Guid exerciseId,
            CreateExerciseTaskDto dto
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<ExerciseTaskDto>.Failure(Errors.NotFound);
            }

            var exerciseTask = new ExerciseTask
            {
                Title = dto.Title,
                Type = dto.Type,
                Order = dto.Order,
                Content = dto.Content,
                ExerciseId = exerciseId,
            };

            await _exerciseTaskRepository.AddAsync(exerciseTask);
            return Result<ExerciseTaskDto>.Success(exerciseTask.ToExerciseTaskDto());
        }

        public async Task<Result> UpdateAsync(
            UserDto user,
            Guid exerciseId,
            Guid taskId,
            UpdateExerciseTaskDto dto
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result.Failure(Errors.NotFound);
            }

            var exerciseTask = await _exerciseTaskRepository.GetByIdAsync(taskId);

            if (exerciseTask == null || exerciseTask.ExerciseId != exercise.Id)
            {
                return Result.Failure(Errors.NotFound);
            }

            exerciseTask.Title = dto.Title;
            exerciseTask.Type = dto.Type;
            exerciseTask.Order = dto.Order;
            exerciseTask.Content = dto.Content;

            await _exerciseTaskRepository.UpdateAsync(exerciseTask);
            return Result.Success();
        }

        public async Task<Result> DeleteAsync(UserDto user, Guid exerciseId, Guid taskId)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result.Failure(Errors.NotFound);
            }

            var exerciseTask = await _exerciseTaskRepository.GetByIdAsync(taskId);

            if (exerciseTask == null || exerciseTask.ExerciseId != exercise.Id)
            {
                return Result.Failure(Errors.NotFound);
            }

            await _exerciseTaskRepository.DeleteAsync(taskId);
            return Result.Success();
        }
    }
}
