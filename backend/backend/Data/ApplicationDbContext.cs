using System.Reflection.Emit;
using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Media> Medias { get; set; } = null!;
        public DbSet<Exercise> Exercises { get; set; } = null!;
        public DbSet<Activity> Activities { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<TeamMember> TeamMembers { get; set; } = null!;
        public DbSet<Answer> Answers { get; set; } = null!;
        public DbSet<Submission> Submissions { get; set; } = null!;
        public DbSet<Session> Sessions { get; set; } = null!;
        public DbSet<SessionUser> SessionUsers { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<ExerciseTag> ExerciseTags { get; set; } = null!;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder
                .Entity<Media>()
                .HasOne(m => m.CreatedByUser)
                .WithMany(u => u.Medias)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Exercise>()
                .HasOne(e => e.User)
                .WithMany(u => u.Exercises)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Tag>().HasIndex(t => new { t.UserId, t.Name }).IsUnique();

            builder.Entity<ExerciseTag>().HasKey(et => new { et.ExerciseId, et.TagId });

            builder
                .Entity<ExerciseTag>()
                .HasOne(et => et.Exercise)
                .WithMany(e => e.ExerciseTags)
                .HasForeignKey(et => et.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<ExerciseTag>()
                .HasOne(et => et.Tag)
                .WithMany(t => t.ExerciseTags)
                .HasForeignKey(et => et.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<ExerciseTag>()
                .HasIndex(et => new { et.ExerciseId, et.TagId })
                .IsUnique();

            builder
                .Entity<Activity>()
                .HasOne(a => a.Exercise)
                .WithMany(e => e.Activities)
                .HasForeignKey(a => a.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Session>().HasIndex(s => s.AccessCode).IsUnique();

            builder
                .Entity<Session>()
                .HasOne(s => s.Exercise)
                .WithMany(e => e.Sessions)
                .HasForeignKey(s => s.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Session>()
                .HasOne(s => s.CreatedByUser)
                .WithMany(u => u.Sessions)
                .HasForeignKey(s => s.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SessionUser>().HasKey(su => su.Id);

            builder
                .Entity<SessionUser>()
                .HasOne(su => su.Session)
                .WithMany(s => s.SessionUsers)
                .HasForeignKey(su => su.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<SessionUser>()
                .HasOne(su => su.User)
                .WithMany(u => u.SessionUsers)
                .HasForeignKey(su => su.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<SessionUser>()
                .HasIndex(su => new { su.SessionId, su.UserId })
                .IsUnique();

            builder
                .Entity<Team>()
                .HasOne(t => t.Session)
                .WithMany(s => s.Teams)
                .HasForeignKey(t => t.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TeamMember>().HasKey(tm => new { tm.TeamId, tm.SessionUserId });

            builder
                .Entity<TeamMember>()
                .HasOne(tm => tm.Team)
                .WithMany(t => t.TeamMembers)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<TeamMember>()
                .HasOne(tm => tm.SessionUser)
                .WithOne(su => su.TeamMember)
                .HasForeignKey<TeamMember>(tm => tm.SessionUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Submission>()
                .HasOne(s => s.Session)
                .WithMany(s => s.Submissions)
                .HasForeignKey(s => s.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<SessionUser>()
                .HasOne(su => su.Submission)
                .WithOne(s => s.SessionUser)
                .HasForeignKey<Submission>(s => s.SessionUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Team>()
                .HasOne(t => t.Submission)
                .WithOne(s => s.Team)
                .HasForeignKey<Submission>(s => s.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Answer>()
                .HasOne(a => a.Submission)
                .WithMany(s => s.Answers)
                .HasForeignKey(a => a.SubmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Answer>()
                .HasOne(a => a.Activity)
                .WithMany()
                .HasForeignKey(a => a.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
