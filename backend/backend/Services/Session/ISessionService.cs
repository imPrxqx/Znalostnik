using backend.DTOs;
using backend.Utils;

namespace backend.Services
{
    /// <summary>
    /// Session management service interface for managing and creating sessions, joining users, creating teams in session, creating answer for session users and actions for session.
    /// </summary>
    public interface ISessionService
    {
        /// <summary>
        /// Returns for the user session state
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Session state</returns>
        Task<Result<SessionDto>> GetSessionAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Returns for the user all active session.
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>Sessions</returns>
        Task<Result<IEnumerable<SessionDto>>> GetActiveSessions(UserDto user);

        /// <summary>
        /// Returns for the user all finished sessions.
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>Sessions</returns>
        Task<Result<IEnumerable<SessionDto>>> GetFinishedSessions(UserDto user);

        /// <summary>
        /// Returns for the user session report raw data.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Session report raw data</returns>
        Task<Result<SessionReportDto>> GetSessionReport(UserDto user, Guid sessionId);

        /// <summary>
        /// Starts a session owned by the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Started session</returns>
        Task<Result<SessionDto>> StartSessionAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Ends a session owned by the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Ended session</returns>
        Task<Result<SessionDto>> EndSessionAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Joins the user to a session by access code.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="dto">Data for joining session</param>
        /// <returns>Joined session id</returns>
        Task<Result<Guid>> JoinSessionAsync(UserDto user, CreateSessionUserDto dto);

        /// <summary>
        /// Returns for the user role in session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns></returns>
        Task<Result<string>> GetSessionRoleAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Selects the next activity in a session owned by the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Session</returns>
        Task<Result<SessionDto>> NextActivityAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Selects the previous activity in a session owned by the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Session</returns>
        Task<Result<SessionDto>> PreviousActivityAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Saves the user submitted answer in session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <param name="dto">Submitted saved answer</param>
        /// <returns>Submitted saved answer</returns>
        Task<Result<AnswerDto>> UpdateAnswerAsync(
            UserDto user,
            Guid sessionId,
            CreateAnswerDto dto
        );

        /// <summary>
        /// Confirms the user answer in the session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <param name="dto">Submitted confirmed answer</param>
        /// <returns>Submitted confirmed answer</returns>
        Task<Result<AnswerDto>> ConfirmAnswerAsync(
            UserDto user,
            Guid sessionId,
            CreateAnswerDto dto
        );

        /// <summary>
        /// Creates for the user session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="dto">Data for creating session</param>
        /// <returns>Created session</returns>
        Task<Result<SessionDto>> CreateSessionAsync(UserDto user, CreateSessionDto dto);

        /// <summary>
        /// Deletes for the user active session or finished session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns></returns>
        Task<Result> DeleteSessionAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Returns for the user session user information.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>User information in session</returns>
        Task<Result<SessionUserDto>> GetSessionUserAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Returns for the user all joined users in session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>All joined users in session</returns>
        Task<Result<IEnumerable<SessionUserDto>>> GetSessionUsersAsync(
            UserDto user,
            Guid sessionId
        );

        /// <summary>
        /// Ends the current round in a session owned by the user.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Session</returns>
        Task<Result<SessionDto>> EndSessionRoundAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Apply timer end in session.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Timer end operation result</returns>
        Task<Result> OnTimerEnd(Guid sessionId);

        /// <summary>
        /// Returns for the user active activity
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <param name="activityId">Activity id</param>
        /// <returns>Activity</returns>
        Task<Result<ActivityDTO>> GetSessionExerciseActivityAsync(
            UserDto user,
            Guid sessionId,
            Guid activityId
        );

        /// <summary>
        /// Joins the user to a session team in session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <param name="teamId">Team id</param>
        /// <returns>Joined team</returns>
        Task<Result<TeamDto>> JoinSessionTeamAsync(UserDto user, Guid sessionId, Guid teamId);

        /// <summary>
        /// Creates for the user a session team.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <param name="dto">Data for creating team</param>
        /// <returns>Created team</returns>
        Task<Result<TeamDto>> CreateSessionTeamAsync(
            UserDto user,
            Guid sessionId,
            CreateTeamDto dto
        );

        /// <summary>
        /// Returns for the user information of joined team in session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Team information</returns>
        Task<Result<TeamDto>> GetMySessionTeamAsync(UserDto user, Guid sessionId);

        /// <summary>
        /// Returns for the user informations of all created teams in session.
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="sessionId">Session id</param>
        /// <returns>Teams informations</returns>
        Task<Result<IEnumerable<TeamDto>>> GetSessionTeamsAsync(UserDto user, Guid sessionId);
    }
}
