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
            return Players.TryAdd(user.Id, user);
        }
        public bool RemovePlayer(User user)
        {
            return Players.TryRemove(user.Id, out _);
        }
        public List<string> GetPlayerUsernames()
        {
            return Players.Values.Select(user => user.UserName!).ToList();
        }
    }
}
