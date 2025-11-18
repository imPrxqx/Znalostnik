using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface ISessionUserRepository
    {
        Task<SessionUser?> GetByUserIdAndSessionIdAsync(string userId, Guid sessionId);
        Task<IEnumerable<SessionUser>> GetSessionUsersBySessionIdAsync(Guid sessionId);
        Task<IEnumerable<SessionUser>> GetSessionUsersByUserIdAsync(string userId);
        Task AddAsync(SessionUser sessionUser);
        Task UpdateAsync(SessionUser sessionUser);
        Task DeleteAsync(string userId, Guid sessionId);
    }
}
