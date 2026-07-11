using backend.DTOs;
using backend.Schemas;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/exercises")]
    [Authorize]
    public class ExerciseController : ControllerBase
    {
        private readonly JsonSchemaValidator _jsonSchemaValidator;
        private readonly IExerciseService _exerciseService;
        private readonly IUserService _userService;

        public ExerciseController(
            IExerciseService exerciseService,
            IUserService userService,
            JsonSchemaValidator jsonSchemaValidator
        )
        {
            _exerciseService = exerciseService;
            _userService = userService;
            _jsonSchemaValidator = jsonSchemaValidator;
        }

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

            bool isValid = true;

            foreach (var activity in dto.Activities)
            {
                if (
                    !_jsonSchemaValidator.Validate(
                        "Activities",
                        "activity",
                        activity.Style.RootElement.GetRawText()
                    )
                )
                {
                    isValid = false;
                    break;
                }

                if (
                    !_jsonSchemaValidator.Validate(
                        "Activities",
                        activity.Type,
                        activity.Content.RootElement.GetRawText()
                    )
                )
                {
                    isValid = false;
                    break;
                }

                if (
                    !_jsonSchemaValidator.Validate(
                        "Solutions",
                        activity.Type,
                        activity.Solution.RootElement.GetRawText()
                    )
                )
                {
                    isValid = false;
                    break;
                }
            }

            if (!isValid)
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
