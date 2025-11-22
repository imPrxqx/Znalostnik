using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class ExerciseTagRepository : IExerciseTagRepository
    {
        private readonly ApplicationDbContext _context;

        public ExerciseTagRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ExerciseTag?> GetExerciseTagByIdAsync(Guid exerciseId, string tag)
        {
            return await _context.ExerciseTags.FirstOrDefaultAsync(et =>
                et.ExerciseId == exerciseId && et.Tag == tag
            );
        }

        public async Task<IEnumerable<ExerciseTag>> GetAllTagsByExerciseIdAsync(Guid exerciseId)
        {
            return await _context
                .ExerciseTags.Where(et => et.ExerciseId == exerciseId)
                .ToListAsync();
        }

        public async Task AddAsync(ExerciseTag exerciseTag)
        {
            await _context.ExerciseTags.AddAsync(exerciseTag);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ExerciseTag exerciseTag)
        {
            _context.ExerciseTags.Update(exerciseTag);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid exerciseId, string tag)
        {
            var exerciseTag = await _context.ExerciseTags.FirstOrDefaultAsync(et =>
                et.ExerciseId == exerciseId && et.Tag == tag
            );

            if (exerciseTag != null)
            {
                _context.ExerciseTags.Remove(exerciseTag);
                await _context.SaveChangesAsync();
            }
        }
    }
}
