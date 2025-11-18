using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class TeamMemberRepository : ITeamMemberRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamMemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TeamMember?> GetByIdAsync(Guid sessionUserId, Guid teamId)
        {
            return await _context.TeamMembers.FirstOrDefaultAsync(tm =>
                tm.SessionUserId == sessionUserId && tm.TeamId == teamId
            );
        }

        public async Task<IEnumerable<TeamMember>> GetTeamMembersByTeamIdAsync(Guid teamId)
        {
            return await _context.TeamMembers.Where(tm => tm.TeamId == teamId).ToListAsync();
        }

        public async Task<IEnumerable<TeamMember>> GetTeamByTeamMemberIdAsync(Guid sessionUserId)
        {
            return await _context
                .TeamMembers.Where(tm => tm.SessionUserId == sessionUserId)
                .ToListAsync();
        }

        public async Task AddAsync(TeamMember member)
        {
            await _context.TeamMembers.AddAsync(member);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TeamMember member)
        {
            _context.TeamMembers.Update(member);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid sessionUserId, Guid teamId)
        {
            var teamMember = await GetByIdAsync(sessionUserId, teamId);

            if (teamMember != null)
            {
                _context.TeamMembers.Remove(teamMember);
                await _context.SaveChangesAsync();
            }
        }
    }
}
