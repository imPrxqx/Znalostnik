using backend.DTOs;
using backend.Schemas;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing exercises.
    /// Require authentication of the user.
    /// </summary>
    [ApiController]
    [Route("api/exercises")]
    [Authorize]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;
        private readonly IUserService _userService;

        public ExerciseController(IExerciseService exerciseService, IUserService userService)
        {
            _exerciseService = exerciseService;
            _userService = userService;
        }

        /// <summary>
        /// Returns for the current user all created exercises.
        /// </summary>
        /// <returns>Exercises with exercise tags</returns>y
        [HttpGet]
        public async Task<IActionResult> GetExercises()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var exercises = await _exerciseService.GetExercisesAsync(user.Value);

            return Ok(exercises.Value);
        }

        /// <summary>
        /// Returns for the current user selected exercise.
        /// </summary>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>Exercise with activities, exercise tags</returns>
        [HttpGet("{exerciseId}")]
        public async Task<IActionResult> GetExercise(Guid exerciseId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var exercise = await _exerciseService.GetExerciseAsync(user.Value, exerciseId);

            if (exercise.IsFailure)
            {
                return NotFound($"{exercise.Error.Type}: {exercise.Error.Description}");
            }

            return Ok(exercise.Value);
        }

        /// <summary>
        /// Returns for the current user selected exercise first available activity.
        /// </summary>
        /// <param name="exerciseId">Exercise id</param>
        /// <returns>First available activity from selected exercise</returns>
        [HttpGet("{exerciseId}/activities/first")]
        public async Task<IActionResult> GetFirstExerciseActivity(Guid exerciseId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var exercise = await _exerciseService.GetFirstExerciseActivityAsync(
                user.Value,
                exerciseId
            );

            if (exercise.IsFailure)
            {
                return NotFound($"{exercise.Error.Type}: {exercise.Error.Description}");
            }

            return Ok(exercise.Value);
        }

        /// <summary>
        /// Creates for the current user empty exercise.
        /// </summary>
        /// <param name="dto">Data for creating exercise</param>
        /// <returns>Empty exercise</returns>
        [HttpPost]
        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDto dto)
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

            var result = await _exerciseService.CreateExerciseAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        /// <summary>
        /// Updates an existing exercise with new data for the current user.
        /// </summary>
        /// <param name="exerciseId">Exercise id</param>
        /// <param name="dto">Data for updating exercise</param>
        /// <returns>Update operation result</returns>
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

            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _exerciseService.UpdateExerciseAsync(user.Value, exerciseId, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok();
        }

        /// <summary>
        /// Deletes an existing exercise for the current user
        /// </summary>
        /// <param name="exerciseId"></param>
        /// <returns>Delete operation result</returns>
        [HttpDelete("{exerciseId}")]
        public async Task<IActionResult> DeleteExercise(Guid exerciseId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _exerciseService.DeleteExerciseAsync(user.Value, exerciseId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok();
        }
    }
}
