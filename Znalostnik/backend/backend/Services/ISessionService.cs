using backend.DTOs;
using backend.Models;
using backend.Utils;

namespace backend.Services
{
    public interface ISessionService
    {
        Task<Result<IEnumerable<SessionDto>>> GetUsersCreatedSessions(UserDto user);
        Task<Result> StartSessionAsync(UserDto user, Guid sessionId);
        Task<Result> EndSessionAsync(UserDto user, Guid sessionId);
        Task<Result> JoinSessionAsync(UserDto user, Guid sessionId);
        Task<Result> NextTaskAsync(UserDto user, Guid sessionId);
        Task<Result> PreviousTaskAsync(UserDto user, Guid sessionId);
        Task<Result<SessionDto>> GetByIdAsync(UserDto user, Guid id);
        Task<Result<SessionDto>> CreateAsync(UserDto user, CreateSessionDto dto);
        Task<Result> UpdateAsync(UserDto user, UpdateSessionDto dto);
        Task<Result> DeleteAsync(UserDto user, Guid id);
    }
}
