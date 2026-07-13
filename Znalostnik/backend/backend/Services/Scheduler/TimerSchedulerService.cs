using System.Text.Json;
using backend.Runtime;

namespace backend.Services
{
    /// <summary>
    /// Checks all activated timers.
    /// </summary>
    public class TimerSchedulerService : BackgroundService
    {
        private readonly TimeSpan _interval;
        private readonly IServiceProvider _serviceProvider;

        public TimerSchedulerService(IServiceProvider serviceProvider)
        {
            _interval = TimeSpan.FromSeconds(1);
            _serviceProvider = serviceProvider;
        }

        /// <summary>
        /// Background service with tick rate which activated after interval
        /// </summary>
        /// <param name="stoppingToken">Cancelation token</param>
        /// <returns>Task</returns>
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

        /// <summary>
        /// Finds all ended timers and call service which sends information that in session ended timer.
        /// </summary>
        /// <returns>Task</returns>
        private async Task CheckTimers()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                // Creates services used for sending informations.
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

                    // Checks if timer ended
                    if (json.RootElement.TryGetProperty("TimerEnd", out var timerEndProp))
                    {
                        if (
                            timerEndProp.ValueKind == JsonValueKind.String
                            && DateTime.TryParse(timerEndProp.GetString(), out var timerEnd)
                            && DateTime.UtcNow >= timerEnd
                        )
                        {
                            // If ended call on session that timer ended
                            await sessionService.OnTimerEnd(session.Id);
                        }
                    }
                }
            }
        }
    }
}
