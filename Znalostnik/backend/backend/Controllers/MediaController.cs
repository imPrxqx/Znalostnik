using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing multimedia content.
    /// Require authentication of the user.
    /// </summary>
    [ApiController]
    [Route("api/media")]
    [Authorize]
    public class MediaController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMediaService _mediaService;

        public MediaController(IUserService userService, IMediaService mediaService)
        {
            _userService = userService;
            _mediaService = mediaService;
        }

        /// <summary>
        /// Returns for the current user all created multimedia content metadat.
        /// </summary>
        /// <returns>Medias metadata</returns>
        [HttpGet]
        public async Task<IActionResult> GetMediasMetadata()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _mediaService.GetMediasAsync(user.Value);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        /// <summary>
        /// Returns for the current user multimedia file from media metadata
        /// </summary>
        /// <param name="mediaId">Media id</param>
        /// <returns>Media file</returns>
        [HttpGet("{mediaId}")]
        public async Task<IActionResult> GetMediaFile(Guid mediaId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _mediaService.GetMediaAsync(mediaId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            if (!System.IO.File.Exists(result.Value.Path))
            {
                return NotFound("File not found on disk");
            }

            var stream = new FileStream(
                result.Value.Path,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                10000000,
                useAsync: true
            );

            return File(
                stream,
                result.Value.ContentType,
                result.Value.FileName,
                enableRangeProcessing: true
            );
        }

        /// <summary>
        /// Deletes an existing multimedia content for the current user.
        /// </summary>
        /// <param name="mediaId">Media id</param>
        /// <returns>Delete operation result</returns>
        [HttpDelete("{mediaId}")]
        public async Task<IActionResult> DeleteMedia(Guid mediaId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _mediaService.DeleteMediaAsync(user.Value, mediaId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.IsSuccess);
        }

        /// <summary>
        /// Creates multimedia content for the current user.
        /// </summary>
        /// <param name="file">Multimedia file</param>
        /// <returns>Created media metadata</returns>
        [HttpPost]
        [RequestSizeLimit(10000000)]
        public async Task<IActionResult> CreateMediaFile(IFormFile file)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _mediaService.CreateMediaFileAsync(user.Value, file);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }
    }
}
