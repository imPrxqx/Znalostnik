using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IExerciseTaskService
    {
        Task<IEnumerable<ExerciseTaskDto>> GetExerciseTasksAsync(UserDto user, Guid exerciseId);
        Task<ExerciseTaskDto?> GetExerciseTaskAsync(UserDto user, Guid exerciseId, Guid taskId);
        Task<ExerciseTaskDto?> CreateAsync(UserDto user, CreateExerciseTaskDto dto);
        Task<bool> UpdateAsync(UserDto user, UpdateExerciseTaskDto dto);
        Task<bool> DeleteAsync(UserDto user, Guid exerciseId, Guid taskId);
    }
}
