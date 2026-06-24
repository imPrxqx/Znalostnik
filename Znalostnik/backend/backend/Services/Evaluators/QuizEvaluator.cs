using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.CodeAnalysis;

namespace backend.Services
{
    public class QuizEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "quiz";

        public void Evaluate(RuntimeActivity activity, RuntimeAnswer answer)
        {
            var solution = JsonSerializer.Deserialize<QuizSolution>(activity.Solution);
            var submit = JsonSerializer.Deserialize<QuizAnswer>(answer.Submit);

            if (solution == null || submit == null)
            {
                answer.CorrectPercentage = 0;
                return;
            }

            int correctCount = submit.Selected.Count(x => solution.Correct.Contains(x));
            int wrongCount = submit.Selected.Count(x => !solution.Correct.Contains(x));

            int score = Math.Max(0, correctCount - wrongCount);
            var percentage = (int)Math.Round((double)score / solution.Correct.Count * 100);

            answer.CorrectPercentage = percentage;
        }

        public class QuizSolution
        {
            [JsonPropertyName("correct")]
            public List<string> Correct { get; set; } = new List<string>();
        }

        public class QuizAnswer
        {
            [JsonPropertyName("selected")]
            public List<string> Selected { get; set; } = new List<string>();
        }
    }
}
