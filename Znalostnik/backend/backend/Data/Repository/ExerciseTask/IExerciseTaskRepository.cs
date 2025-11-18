using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface IExerciseTaskRepository
    {
        Task<ExerciseTask?> GetByIdAsync(Guid id);
        Task<IEnumerable<ExerciseTask>> GetByExerciseIdAsync(Guid exerciseId);
        Task AddAsync(ExerciseTask task);
        Task UpdateAsync(ExerciseTask task);
        Task DeleteAsync(Guid id);
    }
}
