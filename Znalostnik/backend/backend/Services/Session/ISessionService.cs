using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Services
{
    public interface ISessionService
    {
        Task<Result<SessionDto>> GetSessionAsync(UserDto user, Guid sessionId);
        Task<Result<IEnumerable<SessionDto>>> GetActiveSessions(UserDto user);
        Task<Result<IEnumerable<SessionDto>>> GetFinishedSessions(UserDto user);
        Task<Result<SessionReportDto>> GetSessionReport(UserDto user, Guid sessionId);
        Task<Result<SessionDto>> StartSessionAsync(UserDto user, Guid sessionId);
        Task<Result<SessionDto>> EndSessionAsync(UserDto user, Guid sessionId);
        Task<Result<Guid>> JoinSessionAsync(UserDto user, CreateSessionUserDto dto);
        Task<Result<string>> GetSessionRoleAsync(UserDto user, Guid sessionId);
        Task<Result<SessionDto>> NextActivityAsync(UserDto user, Guid sessionId);
        Task<Result<SessionDto>> PreviousActivityAsync(UserDto user, Guid sessionId);
        Task<Result<AnswerDto>> UpdateAnswerAsync(
            UserDto user,
            Guid sessionId,
            CreateAnswerDto dto
        );

        Task<Result<AnswerDto>> ConfirmAnswerAsync(
            UserDto user,
            Guid sessionId,
            CreateAnswerDto dto
        );
        Task<Result<SessionDto>> CreateSessionAsync(UserDto user, CreateSessionDto dto);
        Task<Result> DeleteSessionAsync(UserDto user, Guid id);
        Task<Result<SessionUserDto>> GetSessionUserAsync(UserDto user, Guid sessionId);
        Task<Result<IEnumerable<SessionUserDto>>> GetSessionUsersAsync(
            UserDto user,
            Guid sessionId
        );
        Task<Result<SessionDto>> EndSessionRoundAsync(UserDto user, Guid sessionId);
        Task<Result> OnTimerEnd(Guid sessionId);
        Task<Result<ActivityDTO>> GetSessionExerciseActivityAsync(
            UserDto user,
            Guid sessionId,
            Guid activityId
        );

        Task<Result<TeamDto>> JoinSessionTeamAsync(UserDto user, Guid sessionId, Guid teamId);
        Task<Result<TeamDto>> CreateSessionTeamAsync(
            UserDto user,
            Guid sessionId,
            CreateTeamDto dto
        );
        Task<Result<TeamDto>> GetMySessionTeamAsync(UserDto user, Guid sessionId);
        Task<Result<IEnumerable<TeamDto>>> GetSessionTeamsAsync(UserDto user, Guid sessionId);
    }
}
