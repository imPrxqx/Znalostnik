using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.Services
{
    public interface IUserService
    {
        Task<Result<User>> SignInAsGuestUser();
        Task<Result> ForgotPassword(UserForgotPasswordDto dto, string baseUrl);
        Task<Result<UserDto>> GetUserAsync(ClaimsPrincipal userClaims);
        Task<Result> UpdatePassword(UserDto user, UpdateUserPasswordDto dto);
        Task<Result> DeleteUser(UserDto user);
        Task<Result> LogoutAsync();
    }
}
