using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    /// <summary>
    /// Global tag management service interface for managing and creating global tags, exercise tags.
    /// </summary>
    public interface ITagService
    {
        /// <summary>
        /// Creates for the user global tag.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="dto">Data for creating global tag</param>
        /// <returns></returns>
        Task<Result<TagDto>> CreateTagAsync(UserDto user, CreateTagDto dto);

        /// <summary>
        /// Deletes for the user global tag.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="tagId">Global tag id</param>
        /// <returns>Delete operation result</returns>
        Task<Result> DeleteTagAsync(UserDto user, Guid tagId);

        /// <summary>
        /// Returns for the user all global tags.
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>Global tags</returns>
        Task<Result<IEnumerable<TagDto>>> GetTagsAsync(UserDto user);

        /// <summary>
        /// Returns for the user exercise tags for exercise.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Exercise tags</returns>
        Task<Result<IEnumerable<TagDto>>> GetExerciseTagsAsync(UserDto user, Guid exerciseId);

        /// <summary>
        /// Adds a global tag to exercise for the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <param name="tagId">Tag id</param>
        /// <returns>Add operation result</returns>
        Task<Result> AddExerciseTagAsync(UserDto user, Guid exerciseId, Guid tagId);

        /// <summary>
        /// Removes a global tag from exercise for the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <param name="tagId">Tag id</param>
        /// <returns>Remove operation result</returns>
        Task<Result> RemoveExerciseTagAsync(UserDto user, Guid exerciseId, Guid tagId);
    }
}
