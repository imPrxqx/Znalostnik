using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.Services
{
    public interface IUserService
    {
        Task<Result<User>> SignInAsGuestUser();
        Task<Result<UserDto>> GetCurrentUserAsync(ClaimsPrincipal userClaims);
        Task<Result<UserDetailDto>> GetCurrentUserDetailAsync(ClaimsPrincipal userClaims);
        Task LogoutAsync();
    }
}
