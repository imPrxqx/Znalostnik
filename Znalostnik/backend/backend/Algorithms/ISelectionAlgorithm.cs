using backend.Models;

namespace backend.Algorithms
{
    public interface ISelectionAlgorithm
    {
        string AlgorithmType { get; }

        RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState algorithmState
        );
        void UpdatePlayerState(
            AlgorithmsState algorithmState,
            RuntimeActivity activity,
            int correctPercentile
        );
    }
}
