using backend.Managers;
using backend.Monitors;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace backend.Hubs
{
    public class RoomHub : Hub
    {
        private readonly ILogger _logger;

        public RoomHub(ILogger<RoomMonitor> logger)
        {
            _logger = logger;
        }
        public async Task JoinRoom(string roomId, string userId)
        {
            _logger.LogInformation("[User] {user} joined room {room}", userId, roomId);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("messageReceived", $"{userId} joined the room.");
        }

        public async Task SendMessageToRoom(string roomId, string userId, string message)
        {
            _logger.LogInformation("[User] {user} sent message to room {room}: {msg}", userId, roomId, message);

            await Clients.Group(roomId).SendAsync("messageReceived", userId, message);
        }

    }
}
