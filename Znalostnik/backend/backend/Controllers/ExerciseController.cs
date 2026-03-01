using backend.DTOs;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.CodeAnalysis.CSharp.SyntaxTokenParser;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/exercises")]
    [Authorize]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;
        private readonly IExerciseTaskService _exerciseTaskService;
        private readonly IExerciseTagService _exerciseTagService;

        private readonly IUserService _userService;

        public ExerciseController(
            IExerciseService exerciseService,
            IExerciseTaskService exerciseTaskService,
            IExerciseTagService exerciseTagService,
            IUserService userService
        )
        {
            _exerciseService = exerciseService;
            _exerciseTaskService = exerciseTaskService;
            _exerciseTagService = exerciseTagService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> Exercises(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20
        )
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var exercises = await _exerciseService.GetAllUserExercisesAsync(
                user.Value,
                page,
                pageSize
            );

            return Ok(exercises);
        }

        [HttpGet("{exerciseId}")]
        public async Task<IActionResult> Exercise(Guid exerciseId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var exercise = await _exerciseService.GetByIdAsync(user.Value, exerciseId);

            if (exercise.IsFailure)
            {
                return NotFound();
            }

            return Ok(exercise);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseService.CreateAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok(result.Value);
        }

        [HttpPut("{exerciseId}")]
        public async Task<IActionResult> UpdateExercise(
            Guid exerciseId,
            [FromBody] UpdateExerciseDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseService.UpdateAsync(user.Value, exerciseId, dto);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{exerciseId}")]
        public async Task<IActionResult> DeleteExercise(Guid exerciseId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseService.DeleteAsync(user.Value, exerciseId);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("{exerciseId}/tasks")]
        public async Task<ActionResult<IEnumerable<ExerciseTaskDto>>> ExercisesTasks(
            Guid exerciseId
        )
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var exerciseTasks = _exerciseTaskService.GetExerciseTasksAsync(user.Value, exerciseId);
            return Ok(exerciseTasks);
        }

        // Tasks

        [HttpGet("{exerciseId}/tasks/{taskId}")]
        public async Task<ActionResult<ExerciseTaskDto>> ExerciseTask(Guid exerciseId, Guid taskId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseTaskService.GetExerciseTaskAsync(
                user.Value,
                exerciseId,
                taskId
            );

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok(result.Value);
        }

        [HttpPost("{exerciseId}/tasks")]
        public async Task<ActionResult<ExerciseTaskDto>> CreateExerciseTask(
            Guid exerciseId,
            [FromBody] CreateExerciseTaskDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            Result<ExerciseTaskDto> result = await _exerciseTaskService.CreateAsync(
                user.Value,
                exerciseId,
                dto
            );

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok(result.Value);
        }

        [HttpPut("{exerciseId}/tasks/{taskId}")]
        public async Task<IActionResult> UpdateExerciseTask(
            Guid exerciseId,
            Guid taskId,
            [FromBody] UpdateExerciseTaskDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseTaskService.UpdateAsync(
                user.Value,
                exerciseId,
                taskId,
                dto
            );

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{exerciseId}/tasks/{taskId}")]
        public async Task<IActionResult> DeleteExerciseTask(Guid exerciseId, Guid taskId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseTaskService.DeleteAsync(user.Value, exerciseId, taskId);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        // Tags

        [HttpGet("{exerciseId}/tags")]
        public async Task<IActionResult> ExerciseTags(Guid exerciseId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var tags = await _exerciseTagService.GetTagsAsync(user.Value, exerciseId);
            return Ok(tags);
        }

        [HttpPost("{exerciseId}/tags")]
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

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseTagService.CreateTagAsync(user.Value, exerciseId, dto);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPut("{exerciseId}/tags/{tag}")]
        public async Task<IActionResult> UpdateTag(
            Guid exerciseId,
            string tag,
            [FromBody] UpdateExerciseTagDto dto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseTagService.UpdateTagAsync(user.Value, exerciseId, tag, dto);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{exerciseId}/tags/{tag}")]
        public async Task<IActionResult> DeleteTag(Guid exerciseId, string tag)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _exerciseTagService.DeleteTagAsync(user.Value, exerciseId, tag);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
