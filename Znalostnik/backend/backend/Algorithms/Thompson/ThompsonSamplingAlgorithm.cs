using backend.Models;
using MathNet.Numerics.Distributions;

namespace backend.Algorithms
{
    public class ThompsonSamplingAlgorithm : ISelectionAlgorithm
    {
        public string AlgorithmType => "thompson";

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

        private ActivityThompsonKnowledge GetOrCreate(ThompsonState state, string id)
        {
            var item = state.Knowledges.FirstOrDefault(x => x.Id == id);

            if (item != null)
            {
                return item;
            }

            item = new ActivityThompsonKnowledge { Id = id };

            state.Knowledges.Add(item);
            return item;
        }

        private double SampleBeta(double alpha, double beta)
        {
            double x = Gamma.Sample(alpha, 1.0);
            double y = Gamma.Sample(beta, 1.0);

            return x / (x + y);
        }
    }
}
