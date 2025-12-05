using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface ISessionService
    {
        Task<SessionDto?> GetByIdAsync(UserDto user, Guid id);
        Task<SessionDto> CreateAsync(UserDto user, CreateSessionDto dto);
        Task<bool> UpdateAsync(UserDto user, UpdateSessionDto dto);
        Task<bool> DeleteAsync(UserDto user, Guid id);
    }
}
