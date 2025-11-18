using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface ITeamRepository
    {
        Task<Team?> GetByIdAsync(Guid id);
        Task<IEnumerable<Team>> GetTeamsBySessionIdAsync(Guid sessionId);
        Task<IEnumerable<TeamMember>> GetTeamMembersByTeamIdAsync(Guid teamId);
        Task AddAsync(Team team);
        Task UpdateAsync(Team team);
        Task DeleteAsync(Guid id);
    }
}
