using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using backend.DTOs;

namespace backend.Models
{
    public class Session
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RespondType { get; set; } = string.Empty;
        public string GameMode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? AccessCode { get; set; }
        public string GameState { get; set; } = "{}";
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public string CreatedByUserId { get; set; } = string.Empty;
        public User CreatedByUser { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Team> Teams { get; set; } = new List<Team>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();
    }

    public class RuntimeSession
    {
        public Guid Id { get; } = Guid.NewGuid();
        public Guid ExerciseId { get; set; }
        public List<Guid> ActivityIds { get; set; } = new();
        public string Title { get; set; } = string.Empty;
        public string GameMode { get; set; } = string.Empty;
        public string RespondType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string AccessCode { get; set; } = string.Empty;
        public string CreatedByUserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string GameState { get; set; } = "{}";
        public GameSetting GameSetting { get; set; } = null!;
        public List<RuntimeAnswer> Answers { get; set; } = new();
        public List<RuntimeActivity> Activities { get; set; } = new();
        public List<RuntimeSessionUser> SessionUsers { get; set; } = new();
        public List<RuntimeTeam> Teams { get; set; } = new();
    }
}
