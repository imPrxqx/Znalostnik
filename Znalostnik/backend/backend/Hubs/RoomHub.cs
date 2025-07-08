using backend.Domain;
using backend.Managers;
using backend.Monitors;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System.Collections.Concurrent;

namespace backend.Hubs
{
    public class RoomHub : Hub
    {
        public ILogger Logger { get; set; }
        public RoomManager RoomManager { get; set; }

        public RoomHub(ILogger<RoomMonitor> logger, RoomManager roomManager)
        {
            Logger = logger;
            RoomManager = roomManager;
        }

        public override async Task OnConnectedAsync()
        {
            HttpContext? httpContext = Context.GetHttpContext();

            if (httpContext == null)
            {
                await Clients.Caller.SendAsync("ConnectionRejected");
                Context.Abort();
                return;
            }

            IQueryCollection queryCollection = httpContext.Request.Query;

            if (queryCollection == null)
            {
                await Clients.Caller.SendAsync("ConnectionRejected");
                Context.Abort();
                return;
            }

            if (!queryCollection.TryGetValue("roomId", out StringValues roomId) ||
                !queryCollection.TryGetValue("username", out StringValues username) ||
                !queryCollection.TryGetValue("password", out StringValues password))
            {

                await Clients.Caller.SendAsync("ConnectionRejected");
                Context.Abort();
                return;
            }

            if(!RoomManager.TryGetRoom(roomId!, out Room? room) || room!.Password != password)
            {
                await Clients.Caller.SendAsync("ConnectionRejected");
                Context.Abort();
                return;
            }

            string userId;

            if (Context.User?.Identity?.IsAuthenticated == true)
            {
                userId = Context.User.Identity.Name!;
            }
            else
            {
                userId = "temp-" + Guid.NewGuid();
            }

            room!.PlayerManager.AddPlayer(Context.ConnectionId, new Player(userId, username!));
            Context.Items["roomId"] = roomId.ToString();
            List<string> snapshot = room!.PlayerManager.GetPlayerUsernames();

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId!);
            await Clients.Group(roomId!).SendAsync("UpdatePlayers", snapshot);
            await Clients.Caller.SendAsync("ConnectionAccepted");
            await base.OnConnectedAsync();

            Logger.LogInformation("[User] {username} joined room {room} with user id {usedId}", username, roomId, userId);
            Logger.LogInformation("[Room] {roomId}] Player list updated: {count} players", roomId, snapshot.Count);
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.Items.TryGetValue("roomId", out var roomIdObj))
            {
                string roomId = (string)roomIdObj!;

                if (RoomManager.Rooms.TryGetValue(roomId, out var room))
                {
                    string username = room.PlayerManager.GetPlayerUsername(Context.ConnectionId);
                    room.PlayerManager.RemovePlayer(Context.ConnectionId);
                    List<string> snapshot = room.PlayerManager.GetPlayerUsernames();

                    await Clients.Group(roomId).SendAsync("UpdatePlayers", snapshot);

                    Logger.LogInformation("[User] {username} left room {room}", username, roomId);
                    Logger.LogInformation("[Room {roomId}] Player list updated: {count} players", roomId, snapshot.Count);
                }

            }
       
            await base.OnDisconnectedAsync(exception);
        }
    }
}
