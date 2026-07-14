using backend.Models;
using MathNet.Numerics.Distributions;

namespace backend.Algorithms
{
    /// <summary>
    /// Implements Thompson Sampling algorithm for selecting next activity.
    /// Select activities by sampling from their success probability.
    /// </summary>
    public class ThompsonSamplingAlgorithm : ISelectionAlgorithm
    {
        public string AlgorithmType => "thompson";

        /// <summary>
        /// Selects next activity by sampling from beta distribution with each activity and select next activity with high estimated success.
        /// </summary>
        /// <param name="candidates">Activities</param>
        /// <param name="state">Algorithm state</param>
        /// <returns>Next activity</returns>
        public RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState algorithmState
        )
        {
            var state = algorithmState.Thompson;

            RuntimeActivity bestActivity = candidates[0];
            double bestScore = double.NegativeInfinity;

            foreach (var activity in candidates)
            {
                string id = activity.Id.ToString();

                var stats = GetOrCreate(state, id);

                double sample = SampleBeta(stats.Alpha, stats.Beta);

                if (sample > bestScore)
                {
                    bestScore = sample;
                    bestActivity = activity;
                }
            }

            return bestActivity;
        }

        /// <summary>
        /// Updates participant algorithm state beta distribution of answerered activity based on participant result.
        /// Correct increase Alpha, Incorrect increase Beta.
        /// </summary>
        /// <param name="algorithmState">Algorithm state</param>
        /// <param name="activity">Runtime activity</param>
        /// <param name="correctPercentile">Correctness 0 - 100</param>
        public void UpdateParticipantState(
            AlgorithmsState algorithmState,
            RuntimeActivity activity,
            int correctPercentile
        )
        {
            var state = algorithmState.Thompson;

            string id = activity.Id.ToString();

            var stats = GetOrCreate(state, id);

            double p = Math.Clamp(correctPercentile / 100.0, 0.0, 1.0);

            stats.Alpha += p;
            stats.Beta += (1.0 - p);
        }

        /// <summary>
        /// Returns beta distribution parameters for selected activity or creates new default distribution with default values.
        /// </summary>
        /// <param name="state">Algorithm state</param>
        /// <param name="id">Activity Id</param>
        /// <returns>Thompson activity distribution</returns>
        private ThompsonActivityDistribution GetOrCreate(ThompsonState state, string id)
        {
            var item = state.Distributions.FirstOrDefault(x => x.Id == id);

            if (item != null)
            {
                return item;
            }

            item = new ThompsonActivityDistribution { Id = id };

            state.Distributions.Add(item);
            return item;
        }

        /// <summary>
        /// Samples a probability value from a beta distribution usinng alpha and beta values.
        /// </summary>
        /// <param name="alpha">Alpha value</param>
        /// <param name="beta">Beta value</param>
        /// <returns>Sampled probality value</returns>
        private double SampleBeta(double alpha, double beta)
        {
            return Beta.Sample(alpha, beta);
        }
    }
}
