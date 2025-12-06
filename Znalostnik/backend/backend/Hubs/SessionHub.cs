using backend.Data.Repository;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class SessionHub : Hub
    {
        private readonly ISessionService _sessionService;

        public SessionHub(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        public async Task CreateSessionAsync(Guid sessionId) { }

        public async Task StartSessionAsync(Guid sessionId) { }

        public async Task LockAnswersAsync(Guid sessionId) { }

        public async Task RevealCorrectAnswerAsync(Guid sessionId) { }

        public async Task AssignPlayerToTeamAsync(
            string sessionId,
            string playerId,
            string teamName
        ) { }

        public async Task JoinSessionAsync(Guid sessionId) { }

        public async Task JoinTeamInSessionAsync(Guid sessionId, string teamName)
        {
            //var sessionExists = await _sessionService.GetSessionAsync(sessionId);
            //if (sessionExists == null)
            //{
            //    throw new HubException($"Team {sessionId} does not exist");
            //}

            //await Groups.AddToGroupAsync(Context.ConnectionId, $"session:{sessionId}_team:{teamName}");
        }

        public async Task LeaveSessionAsync(string sessionId) { }

        //public async Task SubmitIndividualAnswerAsync(Guid sessionId, AnswerRequestDto answer)
        //{
        //}

        //public async Task SubmitTeamProposalAsync(Guid sessionId, AnswerRequestDto answer, string teamName)
        //{
        //}

        //public async Task SubmitTeamAnswerAsync(Guid sessionId, AnswerRequestDto answer, string teamName)
        //{
        //}

        public async Task NextTaskAsync(string sessionId) { }

        public async Task PreviousTaskAsync(string sessionId) { }

        public async Task JumpToTaskAsync(string sessionId) { }

        private async Task BroadcastSessionStateAsync(string sessionId) { }
    }
}
