using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    public interface IExerciseTaskService
    {
        Task<Result<IEnumerable<ExerciseTaskDto>>> GetExerciseTasksAsync(
            UserDto user,
            Guid exerciseId
        );
        Task<Result<ExerciseTaskDto>> GetExerciseTaskAsync(
            UserDto user,
            Guid exerciseId,
            Guid taskId
        );
        Task<Result<ExerciseTaskDto>> CreateAsync(
            UserDto user,
            Guid exerciseId,
            CreateExerciseTaskDto dto
        );
        Task<Result> UpdateAsync(
            UserDto user,
            Guid exerciseId,
            Guid taskId,
            UpdateExerciseTaskDto dto
        );
        Task<Result> DeleteAsync(UserDto user, Guid exerciseId, Guid taskId);
    }
}
