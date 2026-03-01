using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    public interface IExerciseService
    {
        Task<Result<ExerciseDto>> GetByIdAsync(UserDto user, Guid exerciseId);
        Task<Result<IEnumerable<ExerciseDto>>> GetAllUserExercisesAsync(
            UserDto user,
            int page = 1,
            int pageSize = 20
        );
        Task<Result<IEnumerable<ExerciseDto>>> GetAllUserExercisesByTagsAsync(
            UserDto user,
            string[] tags,
            int page = 1,
            int pageSize = 20
        );
        Task<Result<ExerciseDto>> CreateAsync(UserDto user, CreateExerciseDto dto);
        Task<Result> UpdateAsync(UserDto user, Guid exerciseId, UpdateExerciseDto dto);
        Task<Result> DeleteAsync(UserDto user, Guid exerciseId);
    }
}
