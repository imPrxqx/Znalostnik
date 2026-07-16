using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using backend.DTOs;

namespace backend.Models
{
    /// <summary>
    /// Represents a session created for current exercise.
    /// Stores the session configuration and its game state, including participants, teams, and submissions.
    /// </summary>
    public class Session
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;

        // Is active, lobby or finished
        public string Status { get; set; } = string.Empty;

        // Team or individual
        public string RespondType { get; set; } = string.Empty;

        // Current game mode in session
        public string GameMode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Join code used for joining session
        public string AccessCode { get; set; } = string.Empty;

        // Current state of game mode
        public string GameState { get; set; } = "{}";
        public Guid ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;
        public string CreatedByUserId { get; set; } = string.Empty;
        public User CreatedByUser { get; set; } = null!;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Team> Teams { get; set; } = new List<Team>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();
    }

    /// <summary>
    /// Represents a session created for current exercise in runtime session in memory.
    /// Stores the session configuration and its game state, including participants, teams, and answers.
    /// </summary>
    public class RuntimeSession
    {
        public Guid Id { get; } = Guid.NewGuid();
        public Guid ExerciseId { get; set; }
        public List<Guid> ActivityIds { get; set; } = new();
        public string Title { get; set; } = string.Empty;

        // Current game mode in session
        public string GameMode { get; set; } = string.Empty;

        // Team or individual
        public string RespondType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        // Join code for joining session
        public string AccessCode { get; set; } = string.Empty;
        public string CreatedByUserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Current state of game mode
        public string GameState { get; set; } = "{}";

        // Current game settings on game mode
        public GameSetting GameSetting { get; set; } = null!;
        public List<RuntimeAnswer> Answers { get; set; } = new();
        public List<RuntimeActivity> Activities { get; set; } = new();
        public List<RuntimeSessionUser> SessionUsers { get; set; } = new();
        public List<RuntimeTeam> Teams { get; set; } = new();
    }
}
