using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class SessionUserRepository : ISessionUserRepository
    {
        private readonly ApplicationDbContext _context;

        public SessionUserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SessionUser?> GetByUserIdAndSessionIdAsync(string userId, Guid sessionId)
        {
            return await _context.SessionUsers.FirstOrDefaultAsync(su =>
                su.UserId == userId && su.SessionId == sessionId
            );
        }

        public async Task<IEnumerable<SessionUser>> GetSessionUsersBySessionIdAsync(Guid sessionId)
        {
            return await _context.SessionUsers.Where(su => su.SessionId == sessionId).ToListAsync();
        }

        public async Task<IEnumerable<SessionUser>> GetSessionUsersByUserIdAsync(string userId)
        {
            return await _context.SessionUsers.Where(su => su.UserId == userId).ToListAsync();
        }

        public async Task AddAsync(SessionUser sessionUser)
        {
            await _context.SessionUsers.AddAsync(sessionUser);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SessionUser sessionUser)
        {
            _context.SessionUsers.Update(sessionUser);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string userId, Guid sessionId)
        {
            var sessionUser = await GetByUserIdAndSessionIdAsync(userId, sessionId);
            if (sessionUser != null)
            {
                _context.SessionUsers.Remove(sessionUser);
                await _context.SaveChangesAsync();
            }
        }
    }
}
