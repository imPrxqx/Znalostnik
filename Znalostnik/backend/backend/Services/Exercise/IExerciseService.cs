using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    public interface IExerciseService
    {
        Task<Result<IEnumerable<ExerciseDto>>> GetExercisesAsync(UserDto user);
        Task<Result<ExerciseDto>> GetExerciseAsync(UserDto user, Guid exerciseId);
        Task<Result<ActivityDTO>> GetFirstExerciseActivityAsync(UserDto user, Guid exerciseId);
        Task<Result<ExerciseDto>> CreateExerciseAsync(UserDto user, CreateExerciseDto dto);
        Task<Result> UpdateExerciseAsync(UserDto user, Guid exerciseId, UpdateExerciseDto dto);
        Task<Result> DeleteExerciseAsync(UserDto user, Guid exerciseId);
    }
}
