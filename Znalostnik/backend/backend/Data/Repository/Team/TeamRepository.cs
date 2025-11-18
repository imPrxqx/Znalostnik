using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class TeamRepository : ITeamRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Team?> GetByIdAsync(Guid id)
        {
            return await _context.Teams.FindAsync(id);
        }

        public async Task<IEnumerable<Team>> GetTeamsBySessionIdAsync(Guid sessionId)
        {
            return await _context.Teams.Where(t => t.SessionId == sessionId).ToListAsync();
        }

        public async Task<IEnumerable<TeamMember>> GetTeamMembersByTeamIdAsync(Guid teamId)
        {
            return await _context.TeamMembers.Where(tm => tm.TeamId == teamId).ToListAsync();
        }

        public async Task AddAsync(Team team)
        {
            await _context.Teams.AddAsync(team);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Team team)
        {
            _context.Teams.Update(team);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var team = await GetByIdAsync(id);
            if (team != null)
            {
                _context.Teams.Remove(team);
                await _context.SaveChangesAsync();
            }
        }
    }
}
