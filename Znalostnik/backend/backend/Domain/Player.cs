using System.Collections.Concurrent;
using backend.Managers;
using Microsoft.AspNetCore.Identity;

namespace backend.Domain
{
    public class Player
    {
        public string UserId { get; set; }
        public string Username { get; set; }

        public Player(string userId, string username)
        {
            UserId = userId;
            Username = username;
        }
    }
}
