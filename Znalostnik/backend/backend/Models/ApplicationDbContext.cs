using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }


        public DbSet<Test> test { get; set; }
    }
}
