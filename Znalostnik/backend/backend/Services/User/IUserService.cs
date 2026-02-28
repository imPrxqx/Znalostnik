using System.Security.Claims;
using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetCurrentUserAsync(ClaimsPrincipal userClaims);
        Task<UserDetailDto?> GetCurrentUserDetailAsync(ClaimsPrincipal userClaims);
        Task LogoutAsync();
    }
}
