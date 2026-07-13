using backend.Models;
using backend.Utils;

namespace backend.GameModes
{
    /// <summary>
    /// Game mode interface for behaviour and lifecycle of game mode in session
    /// </summary>
    public interface IGameMode
    {
        /// <summary>
        /// Game mode type which is game mode used for.
        /// </summary>
        string GameModeType { get; }

        /// <summary>
        /// Validates if session can be started.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="participantIds">Participants list which will be participating in session</param>
        /// <returns>Result of validatng</returns>
        Result ValidateStart(RuntimeSession session, List<Guid> participantIds);

        /// <summary>
        /// Starts game mode and creates initial activity assignemnts.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <param name="participantIds">Participants list which will be participating in session</param>
        /// <returns>Initial activity assignemnts for participants</returns>
        List<ActivityAssignment> Start(RuntimeSession session, List<Guid> participantIds);

        /// <summary>
        /// Ends game mode.
        /// </summary>
        /// <param name="session">Runtime session</param>
        void End(RuntimeSession session);

        /// <summary>
        /// Handles a participant answer and updates game state.
        /// </summary>
        /// <param name="participantId">Participant id</param>
        /// <param name="session">Runtime session</param>
        /// <param name="correctPercentile">How much is answer correct</param>
        /// <returns>New activity assignments -- most used for when activites are parallel</returns>
        List<ActivityAssignment> OnAnswer(
            Guid participantId,
            RuntimeSession session,
            int correctPercentile
        );

        /// <summary>
        /// Handles starting of next round (can be as next activity) in session and updates game state.
        /// </summary>
        /// <param name="session">Runtime session</param>
        /// <returns>New activity assignemnts</returns>
        List<ActivityAssignment> OnNextRoundStart(RuntimeSession session);

        /// <summary>
        /// Handles starting of previous round (can be as previous activity) in session  and updates game state.
        /// </summary>
        /// <param name="session"></param>
        /// <returns></returns>
        List<ActivityAssignment> OnPreviousRoundStart(RuntimeSession session);

        /// <summary>
        /// Ends round in session and update game state.
        /// </summary>
        /// <param name="session">Runtime session</param>
        void OnRoundEnd(RuntimeSession session);

        /// <summary>
        /// Handles external change in the game start -- most used when for example timer ends and session needs to be updated. If yes updates game state.
        /// </summary>
        /// <param name="session">Runtime session</param>
        void ProcessStateTransition(RuntimeSession session);

        /// <summary>
        /// Returns for the current participant activity.
        /// </summary>
        /// <param name="participantId">Participant id</param>
        /// <param name="session">Runtime session</param>
        /// <returns>Returns activity id if participant have activity</returns>
        Guid? GetParticipantActivityId(Guid participantId, RuntimeSession session);

        /// <summary>
        /// Returns for the current role (participant or host) game state of session.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="role"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        object GetGameState(RuntimeSession session, string role, Guid? participantId);
    }
}
