using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _sp;
        private readonly IUserService _userService;

        public UserController(
            IUserService userService,
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IServiceProvider sp
        )
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _sp = sp;
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
