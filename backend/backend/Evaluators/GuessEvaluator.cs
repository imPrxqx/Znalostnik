using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;

namespace backend.Evaluators
{
    /// <summary>
    /// Implements evaluator for guess activity
    /// </summary>
    public class GuessEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "guess";

        /// <summary>
        /// Evaluates the submitted answer and calculate correct percentile and write it to answer
        /// </summary>
        /// <param name="activity">Activity with solution</param>
        /// <param name="answer">Submitted answer</param>
        public void Evaluate(RuntimeActivity activity, RuntimeAnswer answer)
        {
            var solution = JsonSerializer.Deserialize<GuessSolution>(activity.Solution);
            var submit = JsonSerializer.Deserialize<GuessAnswer>(answer.Submit);

            if (solution == null || submit == null)
            {
                answer.CorrectPercentage = 0;
                return;
            }

            if (solution.Correct.Equals(submit.Selected))
            {
                answer.CorrectPercentage = 100;
            }
            else
            {
                answer.CorrectPercentage = 0;
            }
        }

        /// <summary>
        /// Structure the solution for guess
        /// </summary>
        public class GuessSolution
        {
            [JsonPropertyName("correct")]
            public string Correct { get; set; } = null!;
        }

        /// <summary>
        /// Structure the answer for guess
        /// </summary>
        public class GuessAnswer
        {
            [JsonPropertyName("selected")]
            public string Selected { get; set; } = null!;
        }
    }
}
