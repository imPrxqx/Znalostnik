using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing users.
    /// Require authentication of the user.
    /// </summary>
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Creates a guest user for the current anonymous user.
        /// </summary>
        /// <returns>Guest user</returns>
        [HttpPost("guest")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateGuest()
        {
            var guestUser = await _userService.SignInAsGuestUser();

            if (guestUser.IsFailure)
            {
                return BadRequest();
            }

            return Ok();
        }

        /// <summary>
        /// Creates a forgot password request for the current anonymous user.
        /// </summary>
        /// <param name="dto">Data for requesting forgot password request</param>
        /// <returns>Request operation result</returns>
        [HttpPost("forgotPasswordV2")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(UserForgotPasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            var result = await _userService.ForgotPassword(dto, baseUrl);

            return Ok();
        }

        /// <summary>
        /// Returns for the current information about him.
        /// </summary>
        /// <returns>Information of the current user</returns>
        [HttpGet("me")]
        public async Task<IActionResult> GetUser()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            return Ok(user.Value);
        }

        /// <summary>
        /// Deletes for the current his user.
        /// </summary>
        /// <returns>Delete operation result</returns>
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteUser()
        {
            var user = await _userService.GetUserAsync(User);

            if (user.IsFailure)
            {
                return Unauthorized();
            }

            var result = await _userService.DeleteUser(user.Value);

            if (result.IsFailure)
            {
                return BadRequest();
            }

            return Ok();
        }

        /// <summary>
        /// Updates for the current a new password.
        /// </summary>
        /// <param name="dto">Data for changing current password</param>
        /// <returns>Update operation result</returns>
        [HttpPost("me/updatePassword")]
        public async Task<IActionResult> UpdatePassword(UpdateUserPasswordDto dto)
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

            var result = await _userService.UpdatePassword(user.Value, dto);

            if (result.IsFailure)
            {
                return BadRequest();
            }

            return Ok();
        }

        /// <summary>
        /// Log out the current user.
        /// </summary>
        /// <returns>Log out operation result</returns>
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.LogoutAsync();
            return Ok(new { message = "Logged out" });
        }
    }
}
