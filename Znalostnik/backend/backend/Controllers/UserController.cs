using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
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

            return Ok(user.Value);
        }

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

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.LogoutAsync();
            return Ok(new { message = "Logged out" });
        }
    }
}
