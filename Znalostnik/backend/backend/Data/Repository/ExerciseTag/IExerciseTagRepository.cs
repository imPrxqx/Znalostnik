using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface IExerciseTagRepository
    {
        Task<ExerciseTag?> GetExerciseTagByIdAsync(Guid exerciseId, string tag);
        Task<IEnumerable<ExerciseTag>> GetAllTagsByExerciseIdAsync(Guid exerciseId);
        Task AddAsync(ExerciseTag exerciseTag);
        Task UpdateAsync(ExerciseTag exerciseTag);
        Task DeleteAsync(Guid exerciseId, string tag);
    }
}
