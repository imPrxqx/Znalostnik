using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.CodeAnalysis;

namespace backend.Evaluators
{
    /// <summary>
    /// Implements evaluator for match up activity
    /// </summary>
    public class MatchUpEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "matchUp";

        /// <summary>
        /// Evaluates the submitted answer and calculate correct percentile and write it to answer
        /// </summary>
        /// <param name="activity">Activity with solution</param>
        /// <param name="answer">Submitted answer</param>
        public void Evaluate(RuntimeActivity activity, RuntimeAnswer answer)
        {
            var solution = JsonSerializer.Deserialize<MatchUpSolution>(activity.Solution);
            var submit = JsonSerializer.Deserialize<MatchUpAnswer>(answer.Submit);

            if (solution == null || submit == null)
            {
                answer.CorrectPercentage = 0;
                return;
            }

            int correctCount = 0;

            foreach (var correctPair in solution.Correct)
            {
                bool exists = submit.Selected.Any(x =>
                    string.Equals(x.LeftId, correctPair.LeftId, StringComparison.OrdinalIgnoreCase)
                    && string.Equals(
                        x.RightId,
                        correctPair.RightId,
                        StringComparison.OrdinalIgnoreCase
                    )
                );

                if (exists)
                {
                    correctCount++;
                }
            }

            var percentage = (int)Math.Round((double)correctCount / solution.Correct.Count * 100);

            answer.CorrectPercentage = percentage;
        }

        /// <summary>
        /// Structure the solution for match up
        /// </summary>
        public class MatchUpSolution
        {
            [JsonPropertyName("correct")]
            public List<MatchUpPair> Correct { get; set; } = new List<MatchUpPair>();
        }

        /// <summary>
        /// Structure the answer for match up
        /// </summary>
        public class MatchUpAnswer
        {
            [JsonPropertyName("selected")]
            public List<MatchUpPair> Selected { get; set; } = new List<MatchUpPair>();
        }

        /// <summary>
        /// Structure match up pair
        /// </summary>
        public class MatchUpPair
        {
            [JsonPropertyName("leftId")]
            public string LeftId { get; set; } = null!;

            [JsonPropertyName("rightId")]
            public string RightId { get; set; } = null!;
        }
    }
}
