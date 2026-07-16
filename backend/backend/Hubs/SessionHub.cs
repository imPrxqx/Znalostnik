using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    /// <summary>
    /// Manages real time communaction via SignalR
    /// </summary>
    public class SessionHub : Hub
    {
        /// <summary>
        /// Joins a the current user to session id group
        /// </summary>
        /// <param name="sessionId"></param>
        /// <returns></returns>
        [Authorize]
        public async Task JoinSessionAsync(Guid sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId.ToString());
        }
    }
}
