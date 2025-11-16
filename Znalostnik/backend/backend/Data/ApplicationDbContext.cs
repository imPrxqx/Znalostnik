using backend.Domain;
using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Exercise> Exercises { get; set; } = null!;
        public DbSet<ExerciseTask> Tasks { get; set; } = null!;
        public DbSet<Session> Assignments { get; set; } = null!;
        public DbSet<Answer> Answers { get; set; } = null!;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Exercise>()
                .HasOne(e => e.User)
                .WithMany(u => u.Exercises)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ExerciseTask>()
                .HasOne(t => t.Exercise)
                .WithMany(e => e.Tasks)
                .HasForeignKey(t => t.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Session>()
                .HasOne(a => a.Exercise)
                .WithMany()
                .HasForeignKey(a => a.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Session>()
                .HasOne(a => a.CreatedByUser)
                .WithMany(u => u.Assignments)
                .HasForeignKey(a => a.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Answer>()
                .HasOne(ans => ans.Task)
                .WithMany()
                .HasForeignKey(ans => ans.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Answer>()
                .HasOne(ans => ans.User)
                .WithMany(u => u.Answers)
                .HasForeignKey(ans => ans.UserId)
                .IsRequired(false);

        }
    }
}
