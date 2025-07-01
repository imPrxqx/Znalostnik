using backend.Domain;
using System.Collections.Concurrent;

namespace backend.Managers
{
    public class RoomManager
    {
        private ConcurrentDictionary<long, Room> _rooms = new();
        private ConcurrentDictionary<long, List<string>> _users = new();



        public Room GetOrCreateRoom(long roomId)
        {
            return _rooms.GetOrAdd(roomId, id => new Room(id));
        }

        public bool TryGetRoom(long roomId, out Room room)
        {
            return _rooms.TryGetValue(roomId, out room!);
        }

        public bool DeleteRoom(long roomId)
        {
            return _rooms.TryRemove(roomId, out _);
        }
        public bool CanJoinRoom(long roomId)
        {
            return TryGetRoom(roomId, out var _);
        }

        public IEnumerable<long> GetAllRoomIds()
        {
            return _rooms.Keys;
        }
    }

}
