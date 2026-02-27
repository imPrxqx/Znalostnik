using System.Security.Claims;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class SessionHub : Hub
    {
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;

        public SessionHub(ISessionService sessionService, IUserService userService)
        {
            _sessionService = sessionService;
            _userService = userService;
        }

        [Authorize]
        public async Task JoinSessionAsync(Guid sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId.ToString());
        }

        public async Task NotifySessionUpdated(Guid sessionId)
        {
            await Clients.Group(sessionId.ToString()).SendAsync("NotifySessionUpdated");
        }
    }
}
