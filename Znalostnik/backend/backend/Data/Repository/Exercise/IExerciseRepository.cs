using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface IExerciseRepository
    {
        Task<Exercise?> GetByIdAsync(Guid id);
        Task<IEnumerable<Exercise>> GetAllUserExercisesAsync(
            string userId,
            int page = 1,
            int pageSize = 20
        );
        Task<IEnumerable<Exercise>> GetAllAsync(int page = 1, int pageSize = 20);
        Task<IEnumerable<Exercise>> GetAllUserExercisesByTagsAsync(
            string userId,
            string[] tags,
            int page = 1,
            int pageSize = 20
        );

        Task<IEnumerable<Exercise>> GetAllByTagsAsync(
            string[] tags,
            int page = 1,
            int pageSize = 20
        );
        Task AddAsync(Exercise exercise);
        Task UpdateAsync(Exercise exercise);
        Task DeleteAsync(Guid id);
    }
}
