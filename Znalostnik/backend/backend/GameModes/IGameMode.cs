using System.Net.NetworkInformation;
using System.Text.Json;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Mono.TextTemplating;
using static System.Collections.Specialized.BitVector32;

namespace backend.GameModes
{
    public interface IGameMode
    {
        string GameModeType { get; }
        Result ValidateStart(RuntimeSession session, List<Guid> participantIds);
        List<ActivityAssignment> Start(RuntimeSession session, List<Guid> participantIds);
        void End(RuntimeSession session);
        bool IsFinished(RuntimeSession session);
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
