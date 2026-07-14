using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    /// <summary>
    /// Is user registered or guest
    /// </summary>
    public enum UserType
    {
        Registered,
        Guest,
    }

    /// <summary>
    /// Represents user of the application.
    /// </summary>
    public class User : IdentityUser
    {
        public UserType UserType { get; set; } = UserType.Registered;
        public ICollection<Media> Medias { get; set; } = new List<Media>();
        public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<SessionUser> SessionUsers { get; set; } = new List<SessionUser>();
    }
}
