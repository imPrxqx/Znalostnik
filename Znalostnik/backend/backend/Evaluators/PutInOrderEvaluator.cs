using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;

namespace backend.Evaluators
{
    /// <summary>
    /// Implements evaluator for put in order activity
    /// </summary>
    public class PutInOrderEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "putInOrder";

        /// <summary>
        /// Evaluates the submitted answer and calculate correct percentile and write it to answer
        /// </summary>
        /// <param name="activity">Activity with solution</param>
        /// <param name="answer">Submitted answer</param>
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

        /// <summary>
        /// Structure the solution for put in order
        /// </summary>
        public class PutInOrderSolution
        {
            [JsonPropertyName("correct")]
            public List<string> Correct { get; set; } = new List<string>();
        }

        /// <summary>
        /// Structure the answer for put in order
        /// </summary>
        public class PutInOrderAnswer
        {
            [JsonPropertyName("selected")]
            public List<string> Selected { get; set; } = new List<string>();
        }
    }
}
