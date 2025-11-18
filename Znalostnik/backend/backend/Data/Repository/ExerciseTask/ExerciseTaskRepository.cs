using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class ExerciseTaskRepository : IExerciseTaskRepository
    {
        private readonly ApplicationDbContext _context;

        public ExerciseTaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ExerciseTask?> GetByIdAsync(Guid id)
        {
            return await _context.ExerciseTasks.FindAsync(id);
        }

        public async Task<IEnumerable<ExerciseTask>> GetByExerciseIdAsync(Guid exerciseId)
        {
            return await _context
                .ExerciseTasks.Where(et => et.ExerciseId == exerciseId)
                .ToListAsync();
        }

        public async Task AddAsync(ExerciseTask task)
        {
            await _context.ExerciseTasks.AddAsync(task);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ExerciseTask task)
        {
            _context.ExerciseTasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var exerciseTask = await GetByIdAsync(id);
            if (exerciseTask != null)
            {
                _context.ExerciseTasks.Remove(exerciseTask);
                await _context.SaveChangesAsync();
            }
        }
    }
}
