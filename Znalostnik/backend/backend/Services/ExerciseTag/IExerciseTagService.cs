using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IExerciseTagService
    {
        Task<IEnumerable<ExerciseTagDto>> GetTagsAsync(UserDto user, Guid exerciseId);
        Task<ExerciseTagDto?> CreateTagAsync(UserDto user, CreateExerciseTagDto dto);
        Task<bool> UpdateTagAsync(UserDto user, UpdateExerciseTagDto dto);
        Task<bool> DeleteTagAsync(UserDto user, DeleteExerciseTagDto dto);
    }
}
