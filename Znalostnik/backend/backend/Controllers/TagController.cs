using backend.DTOs;
using backend.Models;
using backend.Schemas;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using static Microsoft.CodeAnalysis.CSharp.SyntaxTokenParser;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/tags")]
    [Authorize]
    public class TagController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITagService _tagService;

        public TagController(IUserService userService, ITagService tagService)
        {
            _userService = userService;
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var exercises = await _tagService.GetTagsAsync(user.Value);

            return Ok(exercises.Value);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTag([FromBody] CreateTagDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _tagService.CreateTagAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpDelete("{tagId}")]
        public async Task<IActionResult> DeleteTag(Guid tagId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _tagService.DeleteTagAsync(user.Value, tagId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok();
        }

        [HttpGet("exercises/{exerciseId}")]
        public async Task<IActionResult> GetExerciseTags(Guid exerciseId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var exercises = await _tagService.GetExerciseTagsAsync(user.Value, exerciseId);

            return Ok(exercises.Value);
        }

        [HttpPost("{tagId}/exercises/{exerciseId}")]
        public async Task<IActionResult> AddExerciseTag(Guid tagId, Guid exerciseId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _tagService.AddExerciseTagAsync(user.Value, exerciseId, tagId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok();
        }

        [HttpDelete("{tagId}/exercises/{exerciseId}")]
        public async Task<IActionResult> RemoveExerciseTag(Guid tagId, Guid exerciseId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _tagService.RemoveExerciseTagAsync(user.Value, exerciseId, tagId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok();
        }
    }
}
