using System.Security.Claims;
using backend.Models;
using backend.Services;
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
        public async Task<IActionResult> Guest()
        {
            var guestUser = await _userService.SignInAsGuestUser();

            if (guestUser.IsFailure)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user.IsFailure)
            {
                return NotFound();
            }

            return Ok(user.Value);
        }

        [HttpGet("me/detail")]
        public async Task<IActionResult> MeDetail()
        {
            var userDetail = await _userService.GetCurrentUserDetailAsync(User);

            if (userDetail.IsFailure)
            {
                return NotFound();
            }

            return Ok(userDetail.Value);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.LogoutAsync();
            return Ok(new { message = "Logged out" });
        }
    }
}
