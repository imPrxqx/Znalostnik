using backend.DTOs;
using backend.Models;

namespace backend.Runtime
{
    public interface IRuntimeSessionStore
    {
        IEnumerable<RuntimeSession> GetSessions();
        IEnumerable<RuntimeSession> GetSessions(UserDto user);
        RuntimeSession? GetSession(Guid sessionId);
        RuntimeSession? GetSession(string accessCode);
        RuntimeSession CreateSession(RuntimeSession session);
        bool DeleteSession(Guid sessionId);
    }
}
