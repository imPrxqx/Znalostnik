using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.CodeAnalysis;

namespace backend.Services
{
    public class MatchUpEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "matchUp";

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

        public class MatchUpSolution
        {
            [JsonPropertyName("correct")]
            public List<MatchUpPair> Correct { get; set; } = new List<MatchUpPair>();
        }

        public class MatchUpAnswer
        {
            [JsonPropertyName("selected")]
            public List<MatchUpPair> Selected { get; set; } = new List<MatchUpPair>();
        }

        public class MatchUpPair
        {
            [JsonPropertyName("leftId")]
            public string LeftId { get; set; } = null!;

            [JsonPropertyName("rightId")]
            public string RightId { get; set; } = null!;
        }
    }
}
