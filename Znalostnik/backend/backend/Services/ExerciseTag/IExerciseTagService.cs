using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    public interface IExerciseTagService
    {
        Task<Result<IEnumerable<ExerciseTagDto>>> GetTagsAsync(UserDto user, Guid exerciseId);
        Task<Result<ExerciseTagDto>> CreateTagAsync(
            UserDto user,
            Guid exerciseId,
            CreateExerciseTagDto dto
        );
        Task<Result> UpdateTagAsync(
            UserDto user,
            Guid exerciseId,
            string tag,
            UpdateExerciseTagDto dto
        );
        Task<Result> DeleteTagAsync(UserDto user, Guid exerciseId, string tag);
    }
}
