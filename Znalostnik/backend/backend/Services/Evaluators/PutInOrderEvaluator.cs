using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.CodeAnalysis;

namespace backend.Services
{
    public class PutInOrderEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "putInOrder";

        public void Evaluate(RuntimeActivity activity, RuntimeAnswer answer)
        {
            var solution = JsonSerializer.Deserialize<PutInOrderSolution>(activity.Solution);
            var submit = JsonSerializer.Deserialize<PutInOrderAnswer>(answer.Submit);

            if (solution == null || submit == null)
            {
                answer.CorrectPercentage = 0;
                return;
            }

            int correctCount = 0;
            int count = Math.Min(solution.Correct.Count, submit.Selected.Count);

            for (int i = 0; i < count; i++)
            {
                if (
                    string.Equals(
                        solution.Correct[i],
                        submit.Selected[i],
                        StringComparison.OrdinalIgnoreCase
                    )
                )
                {
                    correctCount++;
                }
            }

            var percentage = (int)Math.Round((double)correctCount / solution.Correct.Count * 100);

            answer.CorrectPercentage = percentage;
        }

        public class PutInOrderSolution
        {
            [JsonPropertyName("correct")]
            public List<string> Correct { get; set; } = new List<string>();
        }

        public class PutInOrderAnswer
        {
            [JsonPropertyName("selected")]
            public List<string> Selected { get; set; } = new List<string>();
        }
    }
}
