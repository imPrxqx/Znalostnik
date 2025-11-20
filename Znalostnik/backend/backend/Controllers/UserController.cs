using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await _userService.GetCurrentUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("me/detail")]
        public async Task<IActionResult> MeDetail()
        {
            var userDetail = await _userService.GetCurrentUserDetailAsync(User);

            if (userDetail == null)
            {
                return NotFound();
            }

            return Ok(userDetail);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.LogoutAsync();
            return Ok(new { message = "Logged out" });
        }
    }
}
