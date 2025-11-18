using System.Numerics;

namespace backend.Models
{
    public class TeamMember
    {
        public Guid TeamId { get; set; }
        public Team Team { get; set; } = null!;
        public Guid SessionUserId { get; set; }
        public SessionUser SessionUser { get; set; } = null!;
    }
}
