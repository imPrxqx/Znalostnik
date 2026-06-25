using backend.DTOs;
using backend.Schemas;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/sessions")]
    [Authorize]
    public class SessionController : Controller
    {
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly JsonSchemaValidator _jsonSchemaValidator;

        public SessionController(
            ISessionService sessionService,
            IUserService userService,
            JsonSchemaValidator jsonSchemaValidator
        )
        {
            _sessionService = sessionService;
            _userService = userService;
            _jsonSchemaValidator = jsonSchemaValidator;
        }

        [HttpGet("active")]
        public async Task<IActionResult> ActiveSessions()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetActiveSessions(user.Value);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("finished")]
        public async Task<IActionResult> FinishedSessions()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetFinishedSessions(user.Value);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/me")]
        public async Task<IActionResult> SessionUser(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionUserAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/joined")]
        public async Task<IActionResult> SessionUsers(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionUsersAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/teams")]
        public async Task<IActionResult> SessionTeams(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionTeamsAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/teams/me")]
        public async Task<IActionResult> MySessionTeam(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetMySessionTeamAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/teams/create")]
        public async Task<IActionResult> StartSession(Guid sessionId, [FromBody] CreateTeamDto dto)
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

            var result = await _sessionService.CreateSessionTeamAsync(user.Value, sessionId, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/teams/{teamId}/join")]
        public async Task<IActionResult> StartSession(Guid sessionId, Guid teamId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.JoinSessionTeamAsync(user.Value, sessionId, teamId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}")]
        public async Task<IActionResult> Session(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/role")]
        public async Task<IActionResult> SessionRole(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionRoleAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value.ToJson());
        }

        [HttpPost("{sessionId}/start")]
        public async Task<IActionResult> StartSession(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.StartSessionAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/end")]
        public async Task<IActionResult> EndSession(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.EndSessionAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/end-round")]
        public async Task<IActionResult> EndSessionRound(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.EndSessionRoundAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/next")]
        public async Task<IActionResult> NextActivity(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.NextActivityAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/previous")]
        public async Task<IActionResult> PreviousActivity(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.PreviousActivityAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinSession([FromBody] CreateSessionUserDto dto)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.JoinSessionAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/activites/{activityId}")]
        public async Task<IActionResult> Session(Guid sessionId, Guid activityId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionExerciseActivityAsync(
                user.Value,
                sessionId,
                activityId
            );

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpGet("{sessionId}/report")]
        public async Task<IActionResult> SessionReport(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.GetSessionReport(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/answers/confirm")]
        public async Task<IActionResult> ConfirmAnswer(
            Guid sessionId,
            [FromBody] CreateAnswerDto dto
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

            var activity = await _sessionService.GetSessionExerciseActivityAsync(
                user.Value,
                sessionId,
                dto.ActivityId
            );

            if (activity.IsFailure)
            {
                return NotFound($"{user.Error.Type}: {user.Error.Description}");
            }

            if (
                !_jsonSchemaValidator.Validate(
                    "Answers",
                    activity.Value.Type,
                    dto.Submit.RootElement.GetRawText()
                )
            )
            {
                return BadRequest(ModelState);
            }

            var result = await _sessionService.ConfirmAnswerAsync(user.Value, sessionId, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost("{sessionId}/answers")]
        public async Task<IActionResult> UpdateAnswer(
            Guid sessionId,
            [FromBody] CreateAnswerDto dto
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

            var activity = await _sessionService.GetSessionExerciseActivityAsync(
                user.Value,
                sessionId,
                dto.ActivityId
            );

            if (activity.IsFailure)
            {
                return NotFound($"{user.Error.Type}: {user.Error.Description}");
            }

            if (
                !_jsonSchemaValidator.Validate(
                    "Answers",
                    activity.Value.Type,
                    dto.Submit.RootElement.GetRawText()
                )
            )
            {
                return BadRequest(ModelState);
            }

            var result = await _sessionService.UpdateAnswerAsync(user.Value, sessionId, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSession([FromBody] CreateSessionDto dto)
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

            var result = await _sessionService.CreateSessionAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        [HttpDelete("{sessionId}")]
        public async Task<IActionResult> DeleteSession(Guid sessionId)
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _sessionService.DeleteSessionAsync(user.Value, sessionId);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok();
        }
    }
}
