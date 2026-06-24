using backend.DTOs;
using backend.Models;
using System.Collections.Concurrent;

namespace backend.Runtime
{
    public class RuntimeSessionStore : IRuntimeSessionStore
    {
        private readonly ConcurrentDictionary<Guid, RuntimeSession> _sessions =
            new ConcurrentDictionary<Guid, RuntimeSession>();

        private readonly ConcurrentDictionary<string, Guid> _accessCodeMap =
            new ConcurrentDictionary<string, Guid>();

        public IEnumerable<RuntimeSession> GetSessions()
        {
            var sessions = _sessions.Values.ToList();
            return sessions;
        }

        public IEnumerable<RuntimeSession> GetSessions(UserDto user)
        {
            var sessions = _sessions.Values.Where(s => s.CreatedByUserId == user.Id).ToList();

            return sessions;
        }

        public RuntimeSession? GetSession(Guid sessionId)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
            {
                return session;
            }

            return null;
        }

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
