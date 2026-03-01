using System;
using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Identity;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<Result<UserDto>> GetCurrentUserAsync(ClaimsPrincipal userClaims)
        {
            var userId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Result<UserDto>.Failure(Errors.NotFound);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Result<UserDto>.Failure(Errors.NotFound);
            }

            return Result<UserDto>.Success(user.ToUserDto());
        }

        public async Task<Result<UserDetailDto>> GetCurrentUserDetailAsync(
            ClaimsPrincipal userClaims
        )
        {
            var userId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Result<UserDetailDto>.Failure(Errors.NotFound);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Result<UserDetailDto>.Failure(Errors.NotFound);
            }

            return Result<UserDetailDto>.Success(user.ToUserDetailDto());
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
