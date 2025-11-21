using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IExerciseService
    {
        Task<ExerciseDto?> GetByIdAsync(UserDto user, Guid id);
        Task<IEnumerable<ExerciseDto>> GetAllUserExercisesAsync(UserDto user, int page = 1, int pageSize = 20);
        Task<IEnumerable<ExerciseDto>> GetAllUserExercisesByTagsAsync(UserDto user, string[] tags, int page = 1, int pageSize = 20);
        Task<ExerciseDto> CreateAsync(UserDto user, CreateExerciseDto dto);
        Task<bool> UpdateAsync(UserDto user, UpdateExerciseDto dto);
        Task<bool> DeleteAsync(UserDto user, Guid id);
    }

}
