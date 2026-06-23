using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Schemas;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.CodeAnalysis.CSharp.SyntaxTokenParser;

namespace backend.Controllers
{
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

        [HttpGet]
        public async Task<IActionResult> GetMediasMetadata()
        {
            var user = await _userService.GetCurrentUserAsync(User);

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

        [HttpGet("{mediaId}")]
        public async Task<IActionResult> GetMediaFile(Guid mediaId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

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

            return File(stream, result.Value.ContentType, result.Value.FileName);
        }

        [HttpDelete("{mediaId}")]
        public async Task<IActionResult> DeleteMedia(Guid mediaId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

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

        [HttpPost]
        [RequestSizeLimit(10000000)]
        public async Task<IActionResult> CreateMediaFile(IFormFile file)
        {
            var user = await _userService.GetCurrentUserAsync(User);

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
