using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;
using Microsoft.CodeAnalysis;

namespace backend.Evaluators
{
    /// <summary>
    /// Evaluator for quiz activity
    /// </summary>
    public class QuizEvaluator : IAnswerEvaluator
    {
        public string ExerciseActivityType => "quiz";

        /// <summary>
        /// Evaluates the submitted answer and calculate correct percentile and write it to answer
        /// </summary>
        /// <param name="activity">Activity with solution</param>
        /// <param name="answer">Submitted answer</param>
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


        /// <summary>
        /// Structure the solution for quiz
        /// </summary>
        public class QuizSolution
        {
            [JsonPropertyName("correct")]
            public List<string> Correct { get; set; } = new List<string>();
        }

        /// <summary>
        /// Structure the answer for quiz
        /// </summary>
        public class QuizAnswer
        {
            [JsonPropertyName("selected")]
            public List<string> Selected { get; set; } = new List<string>();
        }
    }
}
