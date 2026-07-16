using backend.DTOs;
using backend.Models;

namespace backend.Runtime
{
    /// <summary>
    /// Runtime session store interface for managing and accessing runtime sessions that are active in system.
    /// </summary>
    public interface IRuntimeSessionStore
    {
        /// <summary>
        /// Returns all active runtime sessions.
        /// </summary>
        /// <returns>Runtime sessions</returns>
        IEnumerable<RuntimeSession> GetSessions();

        /// <summary>
        /// Returns for the current user all active runtime sessions.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Runtime sessions</returns>
        IEnumerable<RuntimeSession> GetSessions(UserDto user);

        /// <summary>
        /// Returns runtime session by id.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Runtime session</returns>
        RuntimeSession? GetSession(Guid sessionId);

        /// <summary>
        /// Returns runtime session by access code.
        /// </summary>
        /// <param name="accessCode">Access code</param>
        /// <returns>Runtime session</returns>
        RuntimeSession? GetSession(string accessCode);

        /// <summary>
        /// Creates runtime session into system.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>Created runtime session into system</returns>
        RuntimeSession CreateSession(RuntimeSession session);

        /// <summary>
        /// Deletes runtime sessin from system.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Delete operation result</returns>
        bool DeleteSession(Guid sessionId);
    }
}
