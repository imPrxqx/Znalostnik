using System;
using System.Text.Json;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using Humanizer;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<ExerciseTaskDto>> GetExerciseTasksAsync(
            UserDto user,
            Guid exerciseId
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Enumerable.Empty<ExerciseTaskDto>();
            }

            var exerciseTasks = await _exerciseTaskRepository.GetByExerciseIdAsync(exerciseId);

            return exerciseTasks.Select(t => t.ToExerciseTaskDto());
        }

        public async Task<ExerciseTaskDto?> GetExerciseTaskAsync(
            UserDto user,
            Guid exerciseId,
            Guid taskId
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return null;
            }

            var exerciseTask = await _exerciseTaskRepository.GetByIdAsync(taskId);

            if (exerciseTask == null || exerciseTask.ExerciseId != exercise.Id)
            {
                return null;
            }

            return exerciseTask.ToExerciseTaskDto();
        }

        public async Task<ExerciseTaskDto?> CreateAsync(UserDto user, CreateExerciseTaskDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(dto.ExerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return null;
            }

            var exerciseTask = new ExerciseTask
            {
                Title = dto.Title,
                Type = dto.Type,
                Order = dto.Order,
                Content = dto.Content,
                ExerciseId = dto.ExerciseId,
            };

            await _exerciseTaskRepository.AddAsync(exerciseTask);
            return exerciseTask.ToExerciseTaskDto();
        }

        public async Task<bool> UpdateAsync(UserDto user, UpdateExerciseTaskDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(dto.ExerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return false;
            }

            var exerciseTask = await _exerciseTaskRepository.GetByIdAsync(dto.Id);

            if (exerciseTask == null || exerciseTask.ExerciseId != exercise.Id)
            {
                return false;
            }

            exerciseTask.Title = dto.Title;
            exerciseTask.Type = dto.Type;
            exerciseTask.Order = dto.Order;
            exerciseTask.Content = dto.Content;

            await _exerciseTaskRepository.UpdateAsync(exerciseTask);
            return true;
        }

        public async Task<bool> DeleteAsync(UserDto user, Guid exerciseId, Guid taskId)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return false;
            }

            var exerciseTask = await _exerciseTaskRepository.GetByIdAsync(taskId);

            if (exerciseTask == null || exerciseTask.ExerciseId != exercise.Id)
            {
                return false;
            }

            await _exerciseTaskRepository.DeleteAsync(taskId);
            return true;
        }
    }
}
