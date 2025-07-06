using backend.Domain;
using System.Collections.Concurrent;
using System.Text.Json;

namespace backend.Managers
{
    public class PlayerManager
    {

        private ConcurrentDictionary<string, User> Players { get; set; } = new();

        public bool AddPlayer(Player user)
        {
            return true;
        }
        public bool RemovePlayer(Player user)
        {
            return true;
        }
        public List<string> GetPlayerUsernames()
        {
            return Players.Values.Select(user => user.UserName!).ToList();
        }
    }
}
