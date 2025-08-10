using System.Text.Json;

namespace backend.Graders
{
    public class TrueFalseGrader : IExerciseGrader
    {
        public string Type => "trueFalse";

        public JsonElement Grade(JsonElement solution, JsonElement? answer)
        {
            bool correctAnswer = solution.GetProperty("answer").GetBoolean();

            List<bool> correct = new List<bool>();
            List<bool> incorrect = new List<bool>();

            bool? selectedAnswer = null;

            if (
                answer.HasValue && answer.Value.TryGetProperty("answer", out JsonElement answerElem)
            )
            {
                if (answerElem.ValueKind == JsonValueKind.Null)
                {
                    selectedAnswer = null;
                }
                else
                {
                    selectedAnswer = answerElem.GetBoolean();
                }
            }

            if (selectedAnswer.HasValue)
            {
                if (selectedAnswer.Value == correctAnswer)
                {
                    correct.Add(selectedAnswer.Value);
                }
                else
                {
                    incorrect.Add(selectedAnswer.Value);
                    incorrect.Add(correctAnswer);
                }
            }
            else
            {
                incorrect.Add(correctAnswer);
            }

            var feedback = new { correct = correct, incorrect = incorrect };

            string json = JsonSerializer.Serialize(feedback);
            return JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}
