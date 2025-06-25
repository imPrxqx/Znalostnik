using Microsoft.AspNetCore.Identity;
using backend.Managers;

namespace backend.Domain
{
    public class Room
    {
        public string RoomId { get; }
        public DateTime LastActivity { get; private set; }

        public Room(string roomId)
        {
            RoomId = roomId;
        }
    }

}
