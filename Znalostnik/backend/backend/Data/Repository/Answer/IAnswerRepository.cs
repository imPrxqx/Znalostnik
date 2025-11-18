using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface IAnswerRepository
    {
        Task<Answer?> GetByIdAsync(Guid id);
        Task<IEnumerable<Answer>> GetAllBySubmissionIdAsync(Guid submissionId);
        Task AddAsync(Answer answer);
        Task UpdateAsync(Answer answer);
        Task DeleteAsync(Guid id);
    }
}
