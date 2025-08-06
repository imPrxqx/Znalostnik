using System.Reflection.Emit;
using backend.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Exercise> Exercises { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Exercise>().Property(e => e.Content).HasColumnType("jsonb");
        }
    }
}
