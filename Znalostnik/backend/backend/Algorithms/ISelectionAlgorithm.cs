using backend.Models;

namespace backend.Algorithms
{
    /// <summary>
    /// Selection algorithm interface for selecting and updating algorithm state.
    /// </summary>
    public interface ISelectionAlgorithm
    {
        /// <summary>
        /// Algorithm type which is selectin algorithm used for.
        /// </summary>
        string AlgorithmType { get; }

        /// <summary>
        /// Selects from candidates list of activities next activity based on algorithm state.
        /// </summary>
        /// <param name="candidates">Activities candidates</param>
        /// <param name="algorithmState">Algorithm state</param>
        /// <returns>Next selected activity based on algorithm state</returns>
        RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState algorithmState
        );

        /// <summary>
        /// Updates participant algorithm state after answering on activity with result of corretness.
        /// </summary>
        /// <param name="algorithmState">Algorithm state for update</param>
        /// <param name="activity">Runtime activity</param>
        /// <param name="correctPercentile">Correctness of answer  0 - 100</param>
        void UpdateParticipantState(
            AlgorithmsState algorithmState,
            RuntimeActivity activity,
            int correctPercentile
        );
    }
}
