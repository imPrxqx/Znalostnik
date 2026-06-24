using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class TeamMemberDto
    {
        public Guid SessionUserId { get; set; }
        public string? UserName { get; set; } = string.Empty;
    }
}
