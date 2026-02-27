using backend.Data.Repository;
using backend.DTOs;
using backend.Hubs;
using backend.Models;
using backend.Utils;
using Humanizer;
using Microsoft.AspNetCore.SignalR;
using NuGet.Protocol.Core.Types;

namespace backend.Services
{
    public class SessionService : ISessionService
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IHubContext<SessionHub> _sessionHubContext;

        public SessionService(
            ISessionRepository sessionRepository,
            IHubContext<SessionHub> sessionHubContext
        )
        {
            _sessionRepository = sessionRepository;
            _sessionHubContext = sessionHubContext;
        }

        public async Task<Result<IEnumerable<SessionDto>>> GetUsersCreatedSessions(UserDto user)
        {
            var sessions = await _sessionRepository.GetAllByUserAsync(user.Id);

            var sessionsDto = sessions.Select(s => s.ToSessionDto()).ToList();

            return Result<IEnumerable<SessionDto>>.Success(sessionsDto);
        }

        public async Task<Result> StartSessionAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            session.Start();

            await _sessionRepository.UpdateAsync(session);
            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("NotifySessionUpdated");

            return Result.Success();
        }

        public async Task<Result> EndSessionAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            session.End();

            await _sessionRepository.UpdateAsync(session);

            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("NotifySessionUpdated");

            return Result.Success();
        }

        public async Task<Result> JoinSessionAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result.Failure(Errors.InvalidOperation);
            }

            bool alreadyJoined = session.SessionUsers.Any(x => x.UserId == user.Id);

            if (alreadyJoined)
            {
                return Result.Success();
            }

            session.AddUser(user.Id);

            await _sessionRepository.UpdateAsync(session);

            await _sessionHubContext
                .Clients.Group(session.Id.ToString())
                .SendAsync("NotifySessionUpdated");

            return Result.Success();
        }

        public async Task<Result> NextTaskAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            session.NextTask();

            await _sessionRepository.UpdateAsync(session);
            await _sessionHubContext
                .Clients.Group(sessionId.ToString())
                .SendAsync("NotifySessionUpdated");
            return Result.Success();
        }

        public async Task<Result> PreviousTaskAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result.Failure(Errors.UnauthorizedAccess);
            }

            session.PreviousTask();

            await _sessionRepository.UpdateAsync(session);
            await _sessionHubContext
                .Clients.Group(sessionId.ToString())
                .SendAsync("NotifySessionUpdated");
            return Result.Success();
        }

        public async Task<Result<SessionDto>> GetByIdAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result<SessionDto>> CreateAsync(UserDto user, CreateSessionDto dto)
        {
            var session = new Session
            {
                Title = dto.Title,
                IsPublic = dto.IsPublic,
                Status = dto.Status,
                AccessCode = dto.AccessCode,
                ExerciseId = dto.ExerciseId,
                CreatedByUserId = user.Id,
                CreatedAt = DateTime.UtcNow,
            };

            await _sessionRepository.AddAsync(session);

            return Result<SessionDto>.Success(session.ToSessionDto());
        }

        public async Task<Result> UpdateAsync(UserDto user, UpdateSessionDto dto)
        {
            var session = await _sessionRepository.GetByIdAsync(dto.Id);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            session.Title = dto.Title;
            session.IsPublic = dto.IsPublic;
            session.Status = dto.Status;

            await _sessionRepository.UpdateAsync(session);
            return Result.Success();
        }

        public async Task<Result> DeleteAsync(UserDto user, Guid sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
            {
                return Result<SessionDto>.Failure(Errors.NotFound);
            }

            if (session.CreatedByUserId != user.Id)
            {
                return Result<SessionDto>.Failure(Errors.UnauthorizedAccess);
            }

            await _sessionRepository.DeleteAsync(sessionId);
            return Result.Success();
        }
    }
}
