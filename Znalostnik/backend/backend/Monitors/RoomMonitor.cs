using backend.Managers;

namespace backend.Monitors
{
    public class RoomMonitor : BackgroundService
    {
        public RoomManager RoomManager { get; set; }
        public ILogger Logger { get; set; }
        public TimeSpan Interval { get; set; } =
            TimeSpan.FromMinutes(
                Double.Parse(Environment.GetEnvironmentVariable("ROOM_MONITOR_INTERVAL")!)
            );
        public TimeSpan RoomTimeOut { get; set; } =
            TimeSpan.FromMinutes(
                Double.Parse(Environment.GetEnvironmentVariable("ROOM_TIME_OUT")!)
            );

        public RoomMonitor(ILogger<RoomMonitor> logger, RoomManager roomManager)
        {
            Logger = logger;
            RoomManager = roomManager;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                Logger.LogInformation(
                    "[RoomCleanup] Running at {time} with interval {interval}",
                    DateTime.UtcNow,
                    Interval
                );

                var now = DateTime.UtcNow;

                var toRemove = RoomManager
                    .Rooms.Values.Where(room =>
                        RoomManager.TryGetRoom(room.RoomId, out var outRom)
                        && now - outRom!.LastActivity > RoomTimeOut
                    )
                    .ToList();

                toRemove.ForEach(room =>
                {
                    RoomManager.TryDeleteRoom(room.RoomId);
                    Logger.LogInformation(
                        "[RoomCleanup] Removed room {id} with timeout {timeout}",
                        room.RoomId,
                        RoomTimeOut
                    );
                });

                await Task.Delay(Interval, stoppingToken);
            }
        }
    }
}
