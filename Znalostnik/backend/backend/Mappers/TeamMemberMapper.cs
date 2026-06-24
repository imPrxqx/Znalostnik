using backend.Models;

namespace backend.DTOs
{
    public static class TeamMemberMapper
    {
        public static List<TeamMemberDto> ToTeamMemberDto(this ICollection<TeamMember> teamMembers)
        {
            if (teamMembers == null)
            {
                return new List<TeamMemberDto>();
            }

            return teamMembers
                .Select(tm => new TeamMemberDto
                {
                    SessionUserId = tm.SessionUser.Id,
                    UserName = tm.SessionUser.Username,
                })
                .ToList();
        }
    }
}
