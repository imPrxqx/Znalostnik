using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class TagService : ITagService
    {
        private readonly ApplicationDbContext _context;

        public TagService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result> AddExerciseTagAsync(UserDto user, Guid exerciseId, Guid tagId)
        {
            var exercise = await _context.Exercises.FirstOrDefaultAsync(e => e.Id == exerciseId);

            if (exercise == null)
            {
                return Result.Failure(Errors.ExerciseNotFound);
            }

            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Id == tagId);

            if (tag == null)
            {
                return Result.Failure(Errors.TagNotFound);
            }

            if (exercise.UserId != user.Id || tag.UserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            var exerciseTag = await _context.ExerciseTags.FirstOrDefaultAsync(et =>
                et.TagId == tagId && et.ExerciseId == exerciseId
            );

            if (exerciseTag == null)
            {
                var newExerciseTag = new ExerciseTag { ExerciseId = exerciseId, TagId = tagId };

                await _context.AddAsync(newExerciseTag);
                await _context.SaveChangesAsync();
            }

            return Result.Success();
        }

        public async Task<Result> RemoveExerciseTagAsync(UserDto user, Guid exerciseId, Guid tagId)
        {
            var exercise = await _context.Exercises.FirstOrDefaultAsync(e => e.Id == exerciseId);

            if (exercise == null)
            {
                return Result.Failure(Errors.ExerciseNotFound);
            }

            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Id == tagId);

            if (tag == null)
            {
                return Result.Failure(Errors.TagNotFound);
            }

            if (exercise.UserId != user.Id || tag.UserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            var exerciseTag = await _context.ExerciseTags.FirstOrDefaultAsync(et =>
                et.TagId == tagId && et.ExerciseId == exerciseId
            );

            if (exerciseTag != null)
            {
                _context.Remove(exerciseTag);
                await _context.SaveChangesAsync();
            }

            return Result.Success();
        }

        public async Task<Result<TagDto>> CreateTagAsync(UserDto user, CreateTagDto dto)
        {
            var name = dto.Name.Trim();

            var tag = await _context.Tags.FirstOrDefaultAsync(t =>
                t.UserId == user.Id && t.Name == name
            );

            if (tag != null)
            {
                return Result<TagDto>.Success(tag.ToTagDto());
            }

            var newTag = new Tag { Name = name, UserId = user.Id };

            await _context.Tags.AddAsync(newTag);
            await _context.SaveChangesAsync();
            return Result<TagDto>.Success(newTag.ToTagDto());
        }

        public async Task<Result> DeleteTagAsync(UserDto user, Guid tagId)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Id == tagId);

            if (tag == null)
            {
                return Result.Failure(Errors.TagNotFound);
            }

            if (tag.UserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result<IEnumerable<TagDto>>> GetExerciseTagsAsync(
            UserDto user,
            Guid exerciseId
        )
        {
            var tags = await _context
                .Tags.Where(t =>
                    t.UserId == user.Id && t.ExerciseTags.Any(et => et.ExerciseId == exerciseId)
                )
                .Select(t => t.ToTagDto())
                .ToListAsync();

            return Result<IEnumerable<TagDto>>.Success(tags);
        }

        public async Task<Result<IEnumerable<TagDto>>> GetTagsAsync(UserDto user)
        {
            var tags = await _context
                .Tags.Where(t => t.UserId == user.Id)
                .Select(t => t.ToTagDto())
                .ToListAsync();

            return Result<IEnumerable<TagDto>>.Success(tags);
        }
    }
}
