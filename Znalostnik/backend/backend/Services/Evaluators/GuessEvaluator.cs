using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.CodeAnalysis;

namespace backend.Services
{
    public class GuessEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "guess";

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

        public class GuessSolution
        {
            [JsonPropertyName("correct")]
            public string Correct { get; set; } = null!;
        }

        public class GuessAnswer
        {
            [JsonPropertyName("selected")]
            public string Selected { get; set; } = null!;
        }
    }
}
