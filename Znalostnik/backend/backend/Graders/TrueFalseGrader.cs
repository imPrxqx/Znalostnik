using System.Text.Json;

namespace backend.Graders
{
    public class TrueFalseGrader : IExerciseGrader
    {
        public string Type => "trueFalse";

        public JsonElement Grade(JsonElement solution, JsonElement answer)
        {
            bool correctAnswer = solution.GetProperty("answer").GetBoolean();
            bool selectedAnswer = answer.GetProperty("answer").GetBoolean();

            var feedback = new { correct = correctAnswer, answer = selectedAnswer };

            string json = JsonSerializer.Serialize(feedback);
            return JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}
