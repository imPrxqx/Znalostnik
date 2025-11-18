using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface ISubmissionRepository
    {
        Task<Submission?> GetByIdAsync(Guid id);
        Task<Submission?> GetTeamSubmissionByIdAsync(Guid sessionTeamId);
        Task<Submission?> GetSessionUserSubmissionByIdAsync(Guid sessionUserId);
        Task<IEnumerable<Submission>> GetSubmissionsBySessionIdAsync(Guid sessionId);
        Task AddAsync(Submission submission);
        Task UpdateAsync(Submission submission);
        Task DeleteAsync(Guid id);
    }
}
