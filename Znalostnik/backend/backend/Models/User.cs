using Microsoft.AspNetCore.Identity;
using System.Collections.Concurrent;

namespace backend.Models
{
    public class User : IdentityUser {
        public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();

    }
}
