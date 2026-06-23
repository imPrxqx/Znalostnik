using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class Media
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FileName { get; set; } = null!;
        public string Path { get; set; } = null!;
        public string ContentType { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedByUserId { get; set; } = string.Empty;
        public User CreatedByUser { get; set; } = null!;
    }
}
