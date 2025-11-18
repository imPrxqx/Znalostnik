using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface ITeamMemberRepository
    {
        Task<TeamMember?> GetByIdAsync(Guid sessionUserId, Guid teamMemberId);
        Task<IEnumerable<TeamMember>> GetTeamMembersByTeamIdAsync(Guid teamId);
        Task<IEnumerable<TeamMember>> GetTeamByTeamMemberIdAsync(Guid sessionUserId);
        Task AddAsync(TeamMember member);
        Task UpdateAsync(TeamMember member);
        Task DeleteAsync(Guid sessionUserId, Guid teamMemberId);
    }
}
