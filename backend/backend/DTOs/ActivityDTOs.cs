using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class ActivityDTO
    {
        public Guid Id { get; set; }

        // Activity type
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public JsonDocument Style { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument Solution { get; set; } = JsonDocument.Parse("{}");
    }

    public class CreateActivityDTO
    {
        // Activity type
        [Required]
        public string Type { get; set; } = string.Empty;

        // Order in exercise
        [Required]
        public int Order { get; set; }

        [Required]
        public JsonDocument Style { get; set; } = JsonDocument.Parse("{}");

        [Required]
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");

        [Required]
        public JsonDocument Solution { get; set; } = JsonDocument.Parse("{}");
    }
}
