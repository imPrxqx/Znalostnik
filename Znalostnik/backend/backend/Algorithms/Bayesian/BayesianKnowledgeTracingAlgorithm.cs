using backend.Models;

namespace backend.Algorithms
{
    public class BayesianKnowledgeTracingAlgorithm : ISelectionAlgorithm
    {
        public string AlgorithmType => "bayesian";

        private readonly Random _random = new Random();
        private readonly double learnProbability = 0.1;
        private readonly double slipProbability = 0.2;
        private readonly double guessProbability = 0.25;

        public RuntimeActivity SelectNextActivity(
            IReadOnlyList<RuntimeActivity> candidates,
            AlgorithmsState state
        )
        {
            var weights = new List<double>();

            foreach (var activity in candidates)
            {
                var knowledge = GetOrCreateKnowledge(state.Bayesian, activity.Id.ToString());
                double weight = Math.Pow(1.0 - knowledge, 2);
                weights.Add(weight);
            }

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

        public void UpdatePlayerState(
            AlgorithmsState algorithmState,
            RuntimeActivity activity,
            int correctPercentile
        )
        {
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

            double knowledgeProbability = activityKnowledge.Knowledge;
            double correctProbability =
                (knowledgeProbability * (1 - slipProbability))
                / (
                    knowledgeProbability * (1 - slipProbability)
                    + (1 - knowledgeProbability) * guessProbability
                );
            double incorrectProbability =
                (knowledgeProbability * slipProbability)
                / (
                    knowledgeProbability * slipProbability
                    + (1 - knowledgeProbability) * (1 - guessProbability)
                );
            double learnedProbality =
                successProbability * correctProbability
                + (1 - successProbability) * incorrectProbability;
            double updatedKnowledge = learnedProbality + (1 - learnedProbality) * learnProbability;

            activityKnowledge.Knowledge = updatedKnowledge;
        }

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
