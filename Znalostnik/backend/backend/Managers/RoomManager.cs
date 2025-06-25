using backend.Domain;
using System.Collections.Concurrent;

namespace backend.Managers
{
    public class RoomManager
    {
        private ConcurrentDictionary<string, Room> _rooms = new();

        public Room GetOrCreateRoom(string roomId)
        {
            return _rooms.GetOrAdd(roomId, id => new Room(id));
        }

        public bool TryGetRoom(string roomId, out Room room)
        {
            return _rooms.TryGetValue(roomId, out room!);
        }

        public bool RemoveRoom(string roomId)
        {
            return _rooms.TryRemove(roomId, out _);
        }

        public IEnumerable<string> GetAllRoomIds()
        {
            return _rooms.Keys;
        }
        public int RoomCount => _rooms.Count;
    }

}
