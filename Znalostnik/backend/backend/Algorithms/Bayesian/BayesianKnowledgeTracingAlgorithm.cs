using backend.Models;

namespace backend.Algorithms
{
    /// <summary>
    /// Implements Bayesian Knowledge Tracing algorithm for selecting next activity.
    /// Select activities by estimated probability of knowledge from activities.
    /// </summary>
    public class BayesianKnowledgeTracingAlgorithm : ISelectionAlgorithm
    {
        public string AlgorithmType => "bayesian";

        private readonly Random _random = new Random();
        private readonly double learnProbability = 0.1;
        private readonly double slipProbability = 0.2;
        private readonly double guessProbability = 0.25;

        /// <summary>
        /// Selects the next activity using weighted random selection.
        /// Activities with lower estimated knowledge have higher probability of being selected for next activity.
        /// </summary>
        /// <param name="candidates">Activities</param>
        /// <param name="state">Algorithm state</param>
        /// <returns>Next activity</returns>
        public RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState state
        )
        {
            var weights = new List<double>();

            // Gets from all activities with their knowledges values
            foreach (var activity in candidates)
            {
                var knowledge = GetOrCreateKnowledge(state.Bayesian, activity.Id.ToString());

                // Calculate weight of activity knowledge -- the lower knowledge value the higher weight value
                double weight = Math.Pow(1.0 - knowledge, 2);
                weights.Add(weight);
            }

            // Selects an activity using weighted random selection.
            double sum = weights.Sum();
            double roll = _random.NextDouble() * sum;
            double acc = 0;

            for (int i = 0; i < candidates.Count; i++)
            {
                acc += weights[i];
                if (roll <= acc)
                {
                    return candidates[i];
                }
            }

            return candidates[candidates.Count - 1];
        }

        /// <summary>
        /// Updates participant algorithm state knowledge of answerered activity based on participant result.
        /// using Bayesian Knowledge Tracing.
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
            // Convert percentage to probability (0.0 - 1.0).
            double successPercent = Math.Clamp(correctPercentile, 0, 100);
            double successProbability = successPercent / 100.0;

            var state = algorithmState.Bayesian;

            string activityId = activity.Id.ToString();

            var activityKnowledge = state.Knowledges.FirstOrDefault(k => k.Id == activityId);

            if (activityKnowledge == null)
            {
                activityKnowledge = new ActivityBayesianKnowledge { Id = activityId };

                state.Knowledges.Add(activityKnowledge);
            }

            // Current probability of knowledge for this activity.
            double knowledgeProbability = activityKnowledge.Knowledge;

            // Probability that participant answered correctly considering possible guessing.
            double correctProbability =
                (knowledgeProbability * (1 - slipProbability))
                / (
                    knowledgeProbability * (1 - slipProbability)
                    + (1 - knowledgeProbability) * guessProbability
                );

            // Probability that participant answered incorrectly considering possible guessing.
            double incorrectProbability =
                (knowledgeProbability * slipProbability)
                / (
                    knowledgeProbability * slipProbability
                    + (1 - knowledgeProbability) * (1 - guessProbability)
                );

            // Combines current knowledge estimate with result of correct and incorrect probability.
            double learnedProbality =
                successProbability * correctProbability
                + (1 - successProbability) * incorrectProbability;
            double updatedKnowledge = learnedProbality + (1 - learnedProbality) * learnProbability;

            // Update new knowledge probability
            activityKnowledge.Knowledge = updatedKnowledge;
        }

        /// <summary>
        /// Returns activity knowledge or create new default knowledge with default value.
        /// </summary>
        /// <param name="state">Algorithm state</param>
        /// <param name="id">Activity Id</param>
        /// <returns>Bayesian knowledge value</returns>
        private double GetOrCreateKnowledge(BayesianState state, string id)
        {
            var item = state.Knowledges.FirstOrDefault(x => x.Id == id);

            if (item != null)
            {
                return item.Knowledge;
            }

            item = new ActivityBayesianKnowledge { Id = id };
            state.Knowledges.Add(item);
            return item.Knowledge;
        }
    }
}
