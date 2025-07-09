using System.Text.Json;
using backend.Domain;
using backend.Managers;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        public RoomManager RoomManager { get; set; }

        public RoomController(RoomManager roomManager)
        {
            RoomManager = roomManager;
        }

        // POST: api/room
        [HttpPost]
        public IActionResult CreateRoom()
        {
            string roomId = Guid.NewGuid().ToString("N").Substring(0, 8);
            string password = Guid.NewGuid().ToString("N").Substring(0, 4);

            if (
                RoomManager.TryCreateRoom(
                    roomId,
                    password,
                    new User(),
                    out var room,
                    new JsonElement(),
                    new JsonElement()
                )
            )
            {
                return Ok(new { RoomId = roomId, Password = password });
            }
            else
            {
                return StatusCode(500, "Room not created somehow, try again later");
            }
        }

        // DELETE: api/room/{roomId}
        [HttpDelete("{roomId}")]
        public IActionResult DeleteRoom(string roomId)
        {
            if (RoomManager.TryDeleteRoom(roomId))
            {
                return Ok($"Room '{roomId}' removed.");
            }
            else
            {
                return NotFound($"Room '{roomId}' does not exist.");
            }
        }

        // GET: api/room
        [HttpGet]
        public IActionResult GetAllRooms()
        {
            var rooms = RoomManager.Rooms.Select(kvp => new
            {
                room = kvp.Key,
                password = kvp.Value.Password,
            });

            return Ok(rooms);
        }
    }
}
