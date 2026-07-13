using backend.DTOs;
using backend.Schemas;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing sessions, session users, teams, answers.
    /// Require authentication of the user.
    /// </summary>
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

        /// <summary>
        /// Returns for the current user all created active sessions.
        /// </summary>
        /// <returns>Active sessions</returns>
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

        /// <summary>
        /// Returns for the current user all created finished sessions.
        /// </summary>
        /// <returns>Finished sessions</returns>
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

        /// <summary>
        /// Returns for the current user informations in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>User information in session</returns>
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

        /// <summary>
        /// Returns for the current user informations of all joined session users in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Informatins of all joined session users in session</returns>
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

        /// <summary>
        /// Returns for the current user informations of all created teams in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Information of all created teams in session</returns>
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

        /// <summary>
        /// Returns for the current user information of joined team in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Information of joined team</returns>
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

        /// <summary>
        /// Creates for the current user a session team.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <param name="dto">Data for creating team</param>
        /// <returns>Created session team</returns>
        [HttpPost("{sessionId}/teams/create")]
        public async Task<IActionResult> CreateSessionTeam(
            Guid sessionId,
            [FromBody] CreateTeamDto dto
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

            var result = await _sessionService.CreateSessionTeamAsync(user.Value, sessionId, dto);

            if (result.IsFailure)
            {
                return NotFound($"{result.Error.Type}: {result.Error.Description}");
            }

            return Ok(result.Value);
        }

        /// <summary>
        /// Joins the current user to a session team in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <param name="teamId">Team id</param>
        /// <returns>Joined session team</returns>
        [HttpPost("{sessionId}/teams/{teamId}/join")]
        public async Task<IActionResult> JoinSessionTeam(Guid sessionId, Guid teamId)
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

        /// <summary>
        /// Returns for the current user full session state.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Full session state</returns>
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

        /// <summary>
        /// Returns for the current user role in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Session role</returns>
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

        /// <summary>
        /// Starts a session owned by the current user.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Full session state</returns>
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

        /// <summary>
        /// Ends a session owned by the current user.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Full session state</returns>
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

        /// <summary>
        /// Ends the current round in a session owned by the current user.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Full session state</returns>
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

        /// <summary>
        /// Selects the next activity in a session owned by the current user.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Full session state</returns>
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

        /// <summary>
        /// Selects the previous activity in a session owned by the current user.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Full session state</returns>
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

        /// <summary>
        /// Joins the current user to a session by access code.
        /// </summary>
        /// <param name="dto">Data for joining to session</param>
        /// <returns>Id of joined session id</returns>
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

        /// <summary>
        /// Returns raw report data for the current user from a finished session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Raw report data from finished session</returns>
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

        /// <summary>
        /// Confirms the current user answer in the session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <param name="dto">Answer data for submitting</param>
        /// <returns>Confirmed submitted answer</returns>
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

        /// <summary>
        /// Saves the current user submitted answer in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <param name="dto">Answer data</param>
        /// <returns>Submitted answer</returns>
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

        /// <summary>
        /// Creates a session for the current user.
        /// </summary>
        /// <param name="dto">Data for creating session</param>
        /// <returns>Created session</returns>
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

        /// <summary>
        /// Deletes for the current user active or finished session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Delete operation result</returns>
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
