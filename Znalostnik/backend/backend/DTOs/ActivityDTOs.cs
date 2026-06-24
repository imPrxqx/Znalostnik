using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class ActivityDTO
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public JsonDocument Style { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument Solution { get; set; } = JsonDocument.Parse("{}");
    }

    public class CreateActivityDTO
    {
        public string Type { get; set; } = string.Empty;
        public int Order { get; set; }
        public JsonDocument Style { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument Content { get; set; } = JsonDocument.Parse("{}");
        public JsonDocument Solution { get; set; } = JsonDocument.Parse("{}");
    }
}
