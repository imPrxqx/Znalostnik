using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing global and exercise tags.
    /// Require authentication of the user.
    /// </summary>
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

        /// <summary>
        /// Returns for the current user all global tags.
        /// </summary>
        /// <returns>Global tags</returns>
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

        /// <summary>
        /// Creates for the current user global tag.
        /// </summary>
        /// <param name="dto">Data for creating tag</param>
        /// <returns>Created global tag</returns>
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

        /// <summary>
        /// Deletes for the current user global tag.
        /// </summary>
        /// <param name="tagId">Global tag id</param>
        /// <returns>Delete operation result</returns>
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

        /// <summary>
        /// Returns for the current user exercise tags for exercise.
        /// </summary>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Exercise tags</returns>
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

        /// <summary>
        /// Adds a global tag to exercise for the current user.
        /// </summary>
        /// <param name="tagId">Global tag id</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Add operation result</returns>
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

        /// <summary>
        /// Removes a global tag from exercise for the current user.
        /// </summary>
        /// <param name="tagId">Global tag id</param>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Remove operation result</returns>
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
