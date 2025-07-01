
using backend.Managers;

namespace backend.Monitors
{
    public class RoomMonitor : BackgroundService
    {

        private readonly ILogger _logger;
        private readonly RoomManager _roomManager;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(Double.Parse(Environment.GetEnvironmentVariable("ROOM_MONITOR_INTERVAL")!));
        private readonly TimeSpan _roomTimeout = TimeSpan.FromMinutes(Double.Parse(Environment.GetEnvironmentVariable("ROOM_TIME_OUT")!));


        public RoomMonitor(ILogger<RoomMonitor> logger, RoomManager roomManager)
        {
            _logger = logger;
            _roomManager = roomManager;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("[RoomCleanup] Running at {time} with interval {interval}", DateTime.UtcNow, _interval);

                var now = DateTime.UtcNow;

                var toRemove = _roomManager
                    .GetAllRoomIds()
                    .Where(id => _roomManager.TryGetRoom(id, out var room) && now - room.LastActivity > _roomTimeout)
                    .ToList();

                toRemove.ForEach(id =>
                {
                    _roomManager.DeleteRoom(id);
                    _logger.LogInformation("[RoomCleanup] Removed room {id} with timeout {timeout}", id, _roomTimeout);
                });

                await Task.Delay(_interval, stoppingToken);
            }
        }

    }
}
