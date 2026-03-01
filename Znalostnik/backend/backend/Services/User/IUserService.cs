using System.Security.Claims;
using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    public interface IUserService
    {
        Task<Result<UserDto>> GetCurrentUserAsync(ClaimsPrincipal userClaims);
        Task<Result<UserDetailDto>> GetCurrentUserDetailAsync(ClaimsPrincipal userClaims);
        Task LogoutAsync();
    }
}
