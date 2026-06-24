using System.Text.Json;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class TeamDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<SessionUserDto> TeamMembers { get; set; } = new();
    }

    public class CreateTeamDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
