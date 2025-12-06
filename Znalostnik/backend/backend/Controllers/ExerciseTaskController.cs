using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/exercises/{exerciseId}/tasks")]
    [Authorize]
    public class ExerciseTaskController : Controller
    {
        private readonly IExerciseTaskService _exerciseTaskService;
        private readonly IUserService _userService;

        public ExerciseTaskController(
            IExerciseTaskService exerciseTaskService,
            IUserService userService
        )
        {
            _exerciseTaskService = exerciseTaskService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExerciseTaskDto>>> ExercisesTasks(
            Guid exerciseId
        )
        {
            if (User.Identity != null && User.Identity.IsAuthenticated) { }

            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var exerciseTasks = _exerciseTaskService.GetExerciseTasksAsync(user, exerciseId);
            return Ok(exerciseTasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExerciseTaskDto>> ExerciseTask(Guid exerciseId, Guid taskId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var exerciseTask = _exerciseTaskService.GetExerciseTaskAsync(user, exerciseId, taskId);

            if (exerciseTask == null)
            {
                return NotFound();
            }

            return Ok(exerciseTask);
        }

        [HttpPost]
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

            if (user == null)
            {
                return NotFound();
            }

            var created = await _exerciseTaskService.CreateAsync(user, dto);

            if (created == null)
            {
                return NotFound();
            }

            return Ok(created);
        }

        [HttpPut("{id}")]
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

            if (user == null)
            {
                return NotFound();
            }

            var updated = await _exerciseTaskService.UpdateAsync(user, dto);

            if (!updated)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExerciseTask(Guid exerciseId, Guid taskId)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var deleted = await _exerciseTaskService.DeleteAsync(user, exerciseId, taskId);

            if (!deleted)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
