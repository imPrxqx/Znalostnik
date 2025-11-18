using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class User : IdentityUser
    {
        public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();
    }
}
