using Microsoft.AspNetCore.Identity;
using backend.Managers;

namespace backend.Domain
{
    public class Room
    {
        public long RoomId { get; }
        public DateTime LastActivity { get; private set; }

        public Room(long roomId)
        {
            RoomId = roomId;
        }
    }

}
