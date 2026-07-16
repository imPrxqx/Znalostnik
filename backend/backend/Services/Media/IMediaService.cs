using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    /// <summary>
    /// Multimedia management service interface for managing and creating multimedia content.
    /// </summary>
    public interface IMediaService
    {
        /// <summary>
        /// Returns for the user all multimedia metadata.
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>Multimedia metadataas</returns>
        Task<Result<IEnumerable<MediaDto>>> GetMediasAsync(UserDto user);

        /// <summary>
        /// Returns for the user multimedia file.
        /// </summary>
        /// <param name="mediaId">User</param>
        /// <returns>Multimedia file</returns>
        Task<Result<MediaStreamDto>> GetMediaAsync(Guid mediaId);

        /// <summary>
        /// Creates for the user multimedia file.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="file">Multimedia file</param>
        /// <returns>Created media metadata</returns>
        Task<Result<MediaDto>> CreateMediaFileAsync(UserDto user, IFormFile file);

        /// <summary>
        /// Deletes for the user multimedia.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="mediaId">Media id</param>
        /// <returns>Delete operation result</returns>
        Task<Result> DeleteMediaAsync(UserDto user, Guid mediaId);
    }
}
