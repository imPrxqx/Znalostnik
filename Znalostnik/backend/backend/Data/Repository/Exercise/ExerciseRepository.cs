using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class ExerciseRepository : IExerciseRepository
    {
        private readonly ApplicationDbContext _context;

        public ExerciseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Exercise?> GetByIdAsync(Guid id)
        {
            return await _context.Exercises.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Exercise>> GetAllUserExercisesAsync(
            string userId,
            int page = 1,
            int pageSize = 20
        )
        {
            return await _context
                .Exercises.Where(e => e.UserId == userId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exercise>> GetAllAsync(int page = 1, int pageSize = 20)
        {
            return await _context
                .Exercises.Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exercise>> GetAllUserExercisesByTagsAsync(
            string userId,
            string[] tags,
            int page = 1,
            int pageSize = 20
        )
        {
            return await _context
                .Exercises.Where(e => e.UserId == userId)
                .Include(e => e.ExerciseTags)
                .Where(e => e.ExerciseTags.Any(et => tags.Contains(et.Tag)))
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exercise>> GetAllByTagsAsync(
            string[] tags,
            int page = 1,
            int pageSize = 20
        )
        {
            return await _context
                .Exercises.Include(e => e.ExerciseTags)
                .Where(e => e.ExerciseTags.Any(et => tags.Contains(et.Tag)))
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task AddAsync(Exercise exercise)
        {
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Exercise exercise)
        {
            _context.Exercises.Update(exercise);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var exercise = await GetByIdAsync(id);
            if (exercise != null)
            {
                _context.Exercises.Remove(exercise);
                await _context.SaveChangesAsync();
            }
        }
    }
}
