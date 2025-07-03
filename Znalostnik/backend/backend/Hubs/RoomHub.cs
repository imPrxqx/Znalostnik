using backend.Domain;
using backend.Managers;
using backend.Monitors;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace backend.Hubs
{
    public class RoomHub : Hub
    {
        public ILogger Logger { get; set; }
        public RoomManager RoomManager { get; set; }
        public ConcurrentDictionary<string, ConcurrentDictionary<string, string>> _players { get; set; } = new();
        public RoomHub(ILogger<RoomMonitor> logger, RoomManager roomManager)
        {
            Logger = logger;
            RoomManager = roomManager;
        }

        public override async Task OnConnectedAsync()
        {
            HttpContext? httpContext = Context.GetHttpContext();
            string roomId = httpContext!.Request.Query["roomId"].ToString();
            string username = httpContext!.Request.Query["username"].ToString();
            string password = httpContext!.Request.Query["password"].ToString();

            if (string.IsNullOrEmpty(roomId) || string.IsNullOrEmpty(username))
            {
                Context.Abort();
                return;
            }

            username = username + " " + Context.ConnectionId;
           
            var room = _players.GetOrAdd(roomId, _ => new ConcurrentDictionary<string, string>());
            string sessionId = Context.ConnectionId;

            room[sessionId] = username;

            await Groups.AddToGroupAsync(sessionId, roomId);

            List<string> snapshot = _players[roomId].Values.ToList();

            await Clients.Group(roomId).SendAsync("UpdatePlayers", snapshot);

            Logger.LogInformation("[User] {username} joined room {room}", username, roomId);
            Logger.LogInformation("[Room {roomId}] Player list updated: {count} players", roomId, snapshot.Count);

            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            foreach (var (roomId, players) in _players)
            {
                if (players.TryRemove(Context.ConnectionId, out var username))
                {
                    List<string> snapshot = _players[roomId].Values.ToList();

                    await Clients.Group(roomId).SendAsync("UpdatePlayers", snapshot);

                    Logger.LogInformation("[User] {username} left room {room}", username, roomId);
                    Logger.LogInformation("[Room {roomId}] Player list updated: {count} players", roomId, snapshot.Count);

                    break;
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
