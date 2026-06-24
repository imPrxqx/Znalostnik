using backend.Models;

namespace backend.DTOs
{
    public static class TeamMapper
    {
        public static TeamDto ToTeamDto(this Team team)
        {
            return new TeamDto { Id = team.Id, Name = team.Name };
        }

        public static TeamDto ToTeamDto(
            this RuntimeTeam team,
            IDictionary<Guid, RuntimeSessionUser> users
        )
        {
            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                TeamMembers = team
                    .TeamMemberIds.Select(id => users[id].ToSessionUserDto())
                    .ToList(),
            };
        }
    }
}
