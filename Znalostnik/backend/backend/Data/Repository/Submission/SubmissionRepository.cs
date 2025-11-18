using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public SubmissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Submission?> GetByIdAsync(Guid id)
        {
            return await _context.Submissions.FindAsync(id);
        }

        public async Task<Submission?> GetTeamSubmissionByIdAsync(Guid sessionTeamId)
        {
            return await _context.Submissions.FirstOrDefaultAsync(s => s.TeamId == sessionTeamId);
        }

        public async Task<Submission?> GetSessionUserSubmissionByIdAsync(Guid sessionUserId)
        {
            return await _context.Submissions.FirstOrDefaultAsync(s =>
                s.SessionUserId == sessionUserId
            );
        }

        public async Task<IEnumerable<Submission>> GetSubmissionsBySessionIdAsync(Guid sessionId)
        {
            return await _context.Submissions.Where(s => s.SessionId == sessionId).ToListAsync();
        }

        public async Task AddAsync(Submission submission)
        {
            await _context.Submissions.AddAsync(submission);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Submission submission)
        {
            _context.Submissions.Update(submission);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var submission = await GetByIdAsync(id);
            if (submission != null)
            {
                _context.Submissions.Remove(submission);
                await _context.SaveChangesAsync();
            }
        }
    }
}
