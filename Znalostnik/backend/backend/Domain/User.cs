using backend.Managers;
using Microsoft.AspNetCore.Identity;
using System.Collections.Concurrent;

namespace backend.Domain
{
    public class User
    {
        public string UserId { get; set; }
        public string Username { get; set; }

		public User(string userId, string username)
        {
            UserId = userId;
            Username = username;
        }
	}

}
