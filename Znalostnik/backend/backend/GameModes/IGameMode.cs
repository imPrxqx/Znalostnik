using backend.Models;
using backend.Utils;

namespace backend.GameModes
{
    public interface IGameMode
    {
        string GameModeType { get; }
        Result ValidateStart(RuntimeSession session, List<Guid> participantIds);
        List<ActivityAssignment> Start(RuntimeSession session, List<Guid> participantIds);
        void End(RuntimeSession session);
        List<ActivityAssignment> OnAnswer(
            Guid participantId,
            RuntimeSession session,
            int correctPercentile
        );
        List<ActivityAssignment> OnNextRoundStart(RuntimeSession session);
        List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session);
        void OnRoundEnd(RuntimeSession session);
        void ProcessStateTransition(RuntimeSession session);
        Guid? GetParticipantActivityId(Guid participantId, RuntimeSession session);
        object GetGameState(RuntimeSession session, string role, Guid? participantId);
    }
}
