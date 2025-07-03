using backend.Domain;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.Json;

namespace backend.Managers
{
    public class RoomManager
    {

        public ConcurrentDictionary<string, Room> Rooms { get; set; } = new();

        public bool TryCreateRoom(string roomId, string password, User user, out Room? room, JsonElement hostState, JsonElement usersState)
        {
            Room newRoom = new Room(roomId, password, user, hostState, usersState);

            if (Rooms.TryAdd(newRoom.RoomId, newRoom))
            {
                room = newRoom;
                return true;
            }
            room = null;
            return false;
        }

        public bool TryGetRoom(string roomId, out Room? room)
        {
            return Rooms.TryGetValue(roomId, out room);
        }

        public bool TryDeleteRoom(string roomId)
        {
            return Rooms.TryRemove(roomId, out _);
        }
    }

}
