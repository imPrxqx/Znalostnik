using System.Collections.Concurrent;
using System.Text.Json;
using backend.Domain;

namespace backend.Managers
{
    public class PlayerManager
    {
        private ConcurrentDictionary<string, Player> Players { get; set; } = new();

        public void AddPlayer(string connectionId, Player player)
        {
            Players.TryAdd(connectionId, player);
        }

        public void RemovePlayer(string connectionId)
        {
            Players.TryRemove(connectionId, out var _);
        }

        public string GetPlayerUsername(string connectionId)
        {
            Players.TryGetValue(connectionId, out var player);
            return player!.Username;
        }

        public List<string> GetPlayerUsernames()
        {
            return Players.Values.Select(player => player.Username).ToList();
        }
    }
}
