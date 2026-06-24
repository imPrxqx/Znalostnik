using System.Text.Json;
using backend.Runtime;

namespace backend.Services
{
    public class TimerSchedulerService : BackgroundService
    {
        private readonly TimeSpan _interval;
        private readonly IServiceProvider _serviceProvider;

        public TimerSchedulerService(IServiceProvider serviceProvider)
        {
            _interval = TimeSpan.FromSeconds(1);
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckTimers();
                    await Task.Delay(_interval, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    break;
                }
            }
        }

        private async Task CheckTimers()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var sessionService = scope.ServiceProvider.GetRequiredService<ISessionService>();
                var runtimeSessionService =
                    scope.ServiceProvider.GetRequiredService<IRuntimeSessionStore>();
                var sessions = runtimeSessionService.GetSessions();

                foreach (var session in sessions)
                {
                    if (string.IsNullOrEmpty(session.GameState))
                    {
                        continue;
                    }

                    var json = JsonDocument.Parse(session.GameState);

                    if (json.RootElement.TryGetProperty("TimerEnd", out var timerEndProp))
                    {
                        if (
                            timerEndProp.ValueKind == JsonValueKind.String
                            && DateTime.TryParse(timerEndProp.GetString(), out var timerEnd)
                            && DateTime.UtcNow >= timerEnd
                        )
                        {
                            await sessionService.OnTimerEnd(session.Id);
                        }
                    }
                }
            }
        }
    }
}
