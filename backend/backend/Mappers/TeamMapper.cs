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
            IEnumerable<RuntimeSessionUser> sessionUsers
        )
        {
            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                TeamMembers = team
                    .TeamMemberIds.Select(id => sessionUsers.FirstOrDefault(su => su.Id == id))
                    .Where(su => su != null)
                    .Select(su => su!.ToSessionUserDto())
                    .ToList(),
            };
        }
    }
}
