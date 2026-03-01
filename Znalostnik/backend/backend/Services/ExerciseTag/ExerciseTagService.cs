using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using backend.Utils;

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

        public async Task<Result<IEnumerable<ExerciseTagDto>>> GetTagsAsync(
            UserDto user,
            Guid exerciseId
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<IEnumerable<ExerciseTagDto>>.Failure(Errors.NotFound);
            }

            var exerciseTags = await _exerciseTagRepository.GetAllTagsByExerciseIdAsync(exerciseId);

            return Result<IEnumerable<ExerciseTagDto>>.Success(
                exerciseTags.Select(t => t.ToExerciseTagDto())
            );
        }

        public async Task<Result<ExerciseTagDto>> CreateTagAsync(
            UserDto user,
            Guid exerciseId,
            CreateExerciseTagDto dto
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result<ExerciseTagDto>.Failure(Errors.NotFound);
            }

            var exerciseTag = new ExerciseTag { ExerciseId = exerciseId, Tag = dto.Tag };

            await _exerciseTagRepository.AddAsync(exerciseTag);
            return Result<ExerciseTagDto>.Success(exerciseTag.ToExerciseTagDto());
        }

        public async Task<Result> UpdateTagAsync(
            UserDto user,
            Guid exerciseId,
            string tag,
            UpdateExerciseTagDto dto
        )
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result.Failure(Errors.NotFound);
            }

            var exerciseTag = await _exerciseTagRepository.GetExerciseTagByIdAsync(
                exerciseId,
                dto.Tag
            );

            if (exerciseTag == null)
            {
                return Result.Failure(Errors.InvalidOperation);
            }

            exerciseTag.ExerciseId = exerciseId;
            exerciseTag.Tag = dto.Tag;

            await _exerciseTagRepository.UpdateAsync(exerciseTag);
            return Result.Success();
        }

        public async Task<Result> DeleteTagAsync(UserDto user, Guid exerciseId, string tag)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId);

            if (exercise == null || exercise.UserId != user.Id)
            {
                return Result.Failure(Errors.NotFound);
            }

            var exerciseTag = await _exerciseTagRepository.GetExerciseTagByIdAsync(exerciseId, tag);

            if (exerciseTag == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            await _exerciseTagRepository.DeleteAsync(exerciseId, tag);
            return Result.Success();
        }
    }
}
