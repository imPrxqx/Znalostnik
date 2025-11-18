using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface ISessionRepository
    {
        Task<Session?> GetByIdAsync(Guid id);
        Task<Session?> GetByAccessCodeAsync(string accessCode);
        Task<IEnumerable<Session>> GetAllPublicAsync(int page = 1, int pageSize = 20);
        Task<IEnumerable<Session>> GetAllByUserAsync(
            string userId,
            int page = 1,
            int pageSize = 20
        );
        Task AddAsync(Session session);
        Task UpdateAsync(Session session);
        Task DeleteAsync(Guid id);
    }
}
