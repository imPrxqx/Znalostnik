using System.Collections.Concurrent;
using backend.DTOs;
using backend.Models;

namespace backend.Runtime
{
    public class RuntimeSessionStore : IRuntimeSessionStore
    {
        private readonly ConcurrentDictionary<Guid, RuntimeSession> _sessions =
            new ConcurrentDictionary<Guid, RuntimeSession>();

        private readonly ConcurrentDictionary<string, Guid> _accessCodeMap =
            new ConcurrentDictionary<string, Guid>();

        /// <summary>
        /// Returns all active runtime sessions.
        /// </summary>
        /// <returns>Runtime sessions</returns>
        public IEnumerable<RuntimeSession> GetSessions()
        {
            var sessions = _sessions.Values.ToList();
            return sessions;
        }

        /// <summary>
        /// Returns for the current user all active runtime sessions.
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>Runtime sessions</returns>
        public IEnumerable<RuntimeSession> GetSessions(UserDto user)
        {
            var sessions = _sessions.Values.Where(s => s.CreatedByUserId == user.Id).ToList();

            return sessions;
        }

        /// <summary>
        /// Returns runtime session by id.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Runtime session</returns>
        public RuntimeSession? GetSession(Guid sessionId)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
            {
                return session;
            }

            return null;
        }

        /// <summary>
        /// Returns runtime session by access code.
        /// </summary>
        /// <param name="accessCode">Access code</param>
        /// <returns>Runtime session</returns>
        public RuntimeSession? GetSession(string accessCode)
        {
            if (_accessCodeMap.TryGetValue(accessCode, out var sessionId))
            {
                if (_sessions.TryGetValue(sessionId, out var session))
                {
                    return session;
                }
            }

            return null;
        }

        /// <summary>
        /// Creates runtime session into system.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>Runtime session</returns>
        public RuntimeSession CreateSession(RuntimeSession session)
        {
            if (!_sessions.TryAdd(session.Id, session))
            {
                return session;
            }

            if (!string.IsNullOrWhiteSpace(session.AccessCode))
            {
                if (_accessCodeMap.ContainsKey(session.AccessCode))
                {
                    _sessions.TryRemove(session.Id, out _);
                }

                _accessCodeMap.TryAdd(session.AccessCode, session.Id);
            }

            return session;
        }

        /// <summary>
        /// Deletes runtime sessin from system.
        /// </summary>
        /// <param name="sessionId">Session id</param>
        /// <returns>Delete operation result</returns>
        public bool DeleteSession(Guid sessionId)
        {
            if (!_sessions.TryRemove(sessionId, out var session))
            {
                return false;
            }

            if (!_accessCodeMap.TryRemove(session.AccessCode, out var _))
            {
                return false;
            }

            return true;
        }
    }
}
