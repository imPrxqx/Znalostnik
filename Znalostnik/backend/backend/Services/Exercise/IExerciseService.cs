using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    /// <summary>
    /// Exercise management service interface for managing and creating exercises.
    /// </summary>
    public interface IExerciseService
    {
        /// <summary>
        /// Returns for the user all created exercises.
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>Exercises</returns>
        Task<Result<IEnumerable<ExerciseDto>>> GetExercisesAsync(UserDto user);

        /// <summary>
        /// Returns for the user exercise with activities.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Exercise</returns>
        Task<Result<ExerciseDto>> GetExerciseAsync(UserDto user, Guid exerciseId);

        /// <summary>
        /// Returns for the user selected exercise first available activity.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>First available activity</returns>
        Task<Result<ActivityDTO>> GetFirstExerciseActivityAsync(UserDto user, Guid exerciseId);

        /// <summary>
        /// Creates for the user empty exercise.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="dto">Data for creating exercise</param>
        /// <returns>Created exercise</returns>
        Task<Result<ExerciseDto>> CreateExerciseAsync(UserDto user, CreateExerciseDto dto);
        Task<Result> UpdateExerciseAsync(UserDto user, Guid exerciseId, UpdateExerciseDto dto);

        /// <summary>
        /// Deletes for the user exercise.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Delete operation result</returns>
        Task<Result> DeleteExerciseAsync(UserDto user, Guid exerciseId);
    }
}
