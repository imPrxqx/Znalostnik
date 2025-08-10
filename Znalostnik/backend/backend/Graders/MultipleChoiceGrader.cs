using System.Text.Json;

namespace backend.Graders
{
    public class MultipleChoiceGrader : IExerciseGrader
    {
        public string Type => "multipleChoice";

        public JsonElement Grade(JsonElement solution, JsonElement? answer)
        {
            var correctAnswer = solution
                .GetProperty("answer")
                .EnumerateArray()
                .Select(x => x.GetString())
                .ToArray();

            string[] selectedAnswer = Array.Empty<string>();

            if (
                answer.HasValue && answer.Value.TryGetProperty("answer", out JsonElement answerElem)
            )
            {
                if (answerElem.ValueKind == JsonValueKind.Null)
                {
                    selectedAnswer = Array.Empty<string>();
                }
                else
                {
                    selectedAnswer = answerElem
                        .EnumerateArray()
                        .Select(x => x.GetString()!)
                        .ToArray();
                }
            }
            else
            {
                selectedAnswer = Array.Empty<string>();
            }

            var correct = selectedAnswer.Intersect(correctAnswer).ToArray();

            var incorrect = selectedAnswer
                .Except(correctAnswer)
                .Union(correctAnswer.Except(selectedAnswer))
                .ToArray();

            var feedback = new { correct = correct, incorrect = incorrect };

            string json = JsonSerializer.Serialize(feedback);
            return JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}
