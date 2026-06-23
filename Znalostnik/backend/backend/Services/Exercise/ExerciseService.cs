using System;
using System.Reflection.Metadata;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;
using NuGet.Versioning;

namespace backend.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly ApplicationDbContext _context;

        public ExerciseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<ExerciseDto>> GetExerciseAsync(UserDto user, Guid exerciseId)
        {
            var exercise = await _context
                .Exercises.Include(e => e.Activities)
                .Include(e => e.ExerciseTags)
                .ThenInclude(et => et.Tag)
                .FirstOrDefaultAsync(e => e.Id == exerciseId);

            if (exercise == null)
            {
                return Result<ExerciseDto>.Failure(Errors.ExerciseNotFound);
            }

            if (exercise.UserId != user.Id)
            {
                return Result<ExerciseDto>.Failure(Errors.UnauthorizedAccess);
            }

            return Result<ExerciseDto>.Success(exercise.ToExerciseDto());
        }

        public async Task<Result<ActivityDTO>> GetFirstExerciseActivityAsync(
            UserDto user,
            Guid exerciseId
        )
        {
            var activity = await _context
                .Activities.Where(a => a.ExerciseId == exerciseId && a.Order == 0)
                .Include(a => a.Exercise)
                .FirstOrDefaultAsync();

            if (activity == null)
            {
                return Result<ActivityDTO>.Failure(Errors.ExerciseActivityNotFound);
            }

            if (activity.Exercise.UserId != user.Id)
            {
                return Result<ActivityDTO>.Failure(Errors.UnauthorizedAccess);
            }

            return Result<ActivityDTO>.Success(activity.ToActivityDto());
        }

        public async Task<Result<IEnumerable<ExerciseDto>>> GetExercisesAsync(UserDto user)
        {
            var exercises = await _context
                .Exercises.Include(e => e.ExerciseTags)
                .ThenInclude(et => et.Tag)
                .Where(e => e.UserId == user.Id)
                .ToListAsync();

            return Result<IEnumerable<ExerciseDto>>.Success(
                exercises.Select(e => e.ToExerciseDto())
            );
        }

        public async Task<Result<ExerciseDto>> CreateExerciseAsync(
            UserDto user,
            CreateExerciseDto dto
        )
        {
            var exercise = new Exercise
            {
                Title = dto.Title,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _context.Exercises.AddAsync(exercise);
            await _context.SaveChangesAsync();
            return Result<ExerciseDto>.Success(exercise.ToExerciseDto());
        }

        public async Task<Result> UpdateExerciseAsync(
            UserDto user,
            Guid exerciseId,
            UpdateExerciseDto dto
        )
        {
            var exercise = await _context
                .Exercises.Include(e => e.Activities)
                .FirstOrDefaultAsync(e => e.Id == exerciseId);

            if (exercise == null)
            {
                return Result<ExerciseDto>.Failure(Errors.ExerciseNotFound);
            }

            if (exercise.UserId != user.Id)
            {
                return Result<ExerciseDto>.Failure(Errors.UnauthorizedAccess);
            }

            exercise.Title = dto.Title;
            exercise.UpdatedAt = DateTime.UtcNow;
            exercise.Activities.Clear();

            foreach (var activityDto in dto.Activities)
            {
                var newActivity = new Activity();
                newActivity.ExerciseId = exercise.Id;
                newActivity.Type = activityDto.Type;
                newActivity.Order = activityDto.Order;
                newActivity.Style = activityDto.Style.RootElement.GetRawText();
                newActivity.Content = activityDto.Content.RootElement.GetRawText();
                newActivity.Solution = activityDto.Solution.RootElement.GetRawText();
                await _context.Activities.AddAsync(newActivity);
            }

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result> DeleteExerciseAsync(UserDto user, Guid exerciseId)
        {
            var exercise = await _context.Exercises.FindAsync(exerciseId);

            if (exercise == null)
            {
                return Result<ExerciseDto>.Failure(Errors.ExerciseNotFound);
            }

            if (exercise.UserId != user.Id)
            {
                return Result<ExerciseDto>.Failure(Errors.UnauthorizedAccess);
            }

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return Result.Success();
        }
    }
}
