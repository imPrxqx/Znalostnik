using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace backend.DTOs
{
    public class SessionDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string AccessCode { get; set; } = string.Empty;
        public string RespondType { get; set; } = string.Empty;
        public string GameMode { get; set; } = string.Empty;
        public GameSetting GameSetting { get; set; } = null!;
        public object GameState { get; set; } = JsonDocument.Parse("{}");
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid ExerciseId { get; set; }
    }

    public class SessionReportDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string RespondType { get; set; } = string.Empty;
        public List<ActivityDTO> Activities { get; set; } = new List<ActivityDTO>();
        public List<AnswerDto> Answers { get; set; } = new List<AnswerDto>();
        public List<ParticipantDto> Participants { get; set; } = new List<ParticipantDto>();
    }

    public class CreateSessionDto
    {
        [Required]
        public Guid ExerciseId { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string RespondType { get; set; } = null!;

        [Required]
        public string GameMode { get; set; } = null!;

        [Required]
        public GameSetting GameSetting { get; set; } = null!;
    }

    public class ParticipantDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class GameSetting
    {
        public int RoundTime { get; set; } = 30;
        public string SelectionAlgorithm { get; set; } = "random";
        public string ScoringMode { get; set; } = "balanced";
    }
}
