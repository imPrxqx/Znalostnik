using backend.Models;

namespace backend.Algorithms
{
    /// <summary>
    /// Implements random activity selection algorithm.
    /// Select the next activity randomly from list activities
    /// </summary>
    public class RandomAlgorithm : ISelectionAlgorithm
    {
        public string AlgorithmType => "random";

        private readonly Random _random = new Random();

        /// <summary>
        /// Selects the next activity randomly from the list.
        /// </summary>
        /// <param name="candidates">Activities</param>
        /// <param name="state">Algorithm state</param>
        /// <returns>Random next activity</returns>
        public RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState state
        )
        {
            RuntimeActivity activity = candidates[_random.Next(candidates.Count)];
            return activity;
        }

        /// <summary>
        /// Not used in this algorithm
        /// </summary>
        /// <param name="state">Algorithm state</param>
        /// <param name="activity">Activity</param>
        /// <param name="correctPercentile">Correctness 0 - 100</param>
        public void UpdateParticipantState(
            AlgorithmsState state,
            RuntimeActivity activity,
            int correctPercentile
        )
        {
            return;
        }
    }
}
