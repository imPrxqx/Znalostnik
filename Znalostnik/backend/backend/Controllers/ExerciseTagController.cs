using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/exercises/{exerciseId}/exerciseTags")]
    [Authorize]
    public class ExerciseTagController : Controller
    {
        private readonly IExerciseTagService _exerciseTagService;
        private readonly IUserService _userService;

        public ExerciseTagController(
            IExerciseTagService exerciseTagService,
            IUserService userService
        )
        {
            _exerciseTagService = exerciseTagService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> ExerciseTags(Guid exerciseId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var tags = await _exerciseTagService.GetTagsAsync(user, exerciseId);
            return Ok(tags);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExerciseTag(
            Guid exerciseId,
            [FromBody] CreateExerciseTagDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            dto.ExerciseId = exerciseId;

            var exerciseTag = await _exerciseTagService.CreateTagAsync(user, dto);

            return Ok(exerciseTag);
        }

        [HttpPut("{tag}")]
        public async Task<IActionResult> DeleteTag(
            Guid exerciseId,
            [FromBody] UpdateExerciseTagDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var updated = await _exerciseTagService.UpdateTagAsync(user, dto);

            if (updated == false)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{tag}")]
        public async Task<IActionResult> DeleteTag(
            Guid exerciseId,
            [FromBody] DeleteExerciseTagDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var deleted = await _exerciseTagService.DeleteTagAsync(user, dto);

            if (deleted == false)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
