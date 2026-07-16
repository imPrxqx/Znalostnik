using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class MediaDto
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = null!;
        public string ContentType { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class MediaStreamDto
    {
        public string FileName { get; set; } = null!;
        public string ContentType { get; set; } = null!;

        // Path to file content in file system
        public string Path { get; set; } = null!;
    }
}
