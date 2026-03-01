using System.Security.Claims;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.CodeAnalysis.CSharp.SyntaxTokenParser;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/sessions")]
    [Authorize]
    public class SessionController : Controller
    {
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;

        public SessionController(ISessionService sessionService, IUserService userService)
        {
            _sessionService = sessionService;
            _userService = userService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> MySessions()
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.GetUsersCreatedSessions(user.Value);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok(result.Value);
        }

        [HttpPost("{id}/start")]
        public async Task<IActionResult> StartSession(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.StartSessionAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("{id}/end")]
        public async Task<IActionResult> EndSession(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.EndSessionAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("{id}/next")]
        public async Task<IActionResult> NextTask(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.NextTaskAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("{id}/previous")]
        public async Task<IActionResult> PreviousTask(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.PreviousTaskAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinSession(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.PreviousTaskAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Session(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.GetByIdAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
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

            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.CreateAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok(result.Value);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(Guid id, [FromBody] UpdateSessionDto dto)
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

            var result = await _sessionService.UpdateAsync(user.Value, dto);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(Guid id)
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            var result = await _sessionService.DeleteAsync(user.Value, id);

            if (result.IsFailure)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
