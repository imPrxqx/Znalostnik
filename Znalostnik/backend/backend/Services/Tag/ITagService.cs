using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    public interface ITagService
    {
        Task<Result<TagDto>> CreateTagAsync(UserDto user, CreateTagDto dto);
        Task<Result> DeleteTagAsync(UserDto user, Guid tagId);
        Task<Result<IEnumerable<TagDto>>> GetTagsAsync(UserDto user);
        Task<Result<IEnumerable<TagDto>>> GetExerciseTagsAsync(UserDto user, Guid exerciseId);
        Task<Result> AddExerciseTagAsync(UserDto user, Guid exerciseId, Guid tagId);
        Task<Result> RemoveExerciseTagAsync(UserDto user, Guid exerciseId, Guid tagId);
    }
}
