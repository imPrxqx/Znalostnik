using backend.Managers;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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

    }

}
