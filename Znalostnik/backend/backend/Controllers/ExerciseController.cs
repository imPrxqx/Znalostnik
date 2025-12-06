using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/exercises")]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;
        private readonly IUserService _userService;

        public ExerciseController(IExerciseService exerciseService, IUserService userService)
        {
            _exerciseService = exerciseService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> Exercises(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20
        )
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var exercises = await _exerciseService.GetAllUserExercisesAsync(user, page, pageSize);

            return Ok(exercises);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Exercise(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var exercise = await _exerciseService.GetByIdAsync(user, id);

            if (exercise == null)
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

            if (user == null)
            {
                return NotFound();
            }

            var created = await _exerciseService.CreateAsync(user, dto);

            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExercise(Guid id, [FromBody] UpdateExerciseDto dto)
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

            var updated = await _exerciseService.UpdateAsync(user, dto);

            if (!updated)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExercise(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var deleted = await _exerciseService.DeleteAsync(user, id);

            if (!deleted)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
