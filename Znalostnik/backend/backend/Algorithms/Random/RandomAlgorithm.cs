using backend.Models;

namespace backend.Algorithms
{
    public class RandomAlgorithm : ISelectionAlgorithm
    {
        public string AlgorithmType => "random";

        private readonly Random _random = new Random();

        public RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState state
        )
        {
            RuntimeActivity activity = candidates[_random.Next(candidates.Count)];
            return activity;
        }

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
