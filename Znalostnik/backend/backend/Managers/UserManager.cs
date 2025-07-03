using backend.Domain;
using System.Collections.Concurrent;
using System.Text.Json;

namespace backend.Managers
{
    public class UserManager
    {

        private ConcurrentDictionary<string, User> Players { get; set; } = new();

        public bool AddPlayer(User user)
        {
            return Players.TryAdd(user.UserId, user);
        }
        public bool RemovePlayer(User user)
        {
            return Players.TryRemove(user.UserId, out _);
        }
        public List<string> GetPlayerUsernames()
        {
            return Players.Values.Select(user => user.Username).ToList();
        }
    }
}
