using System.Text.Json;
using System.Text.Json.Nodes;
using System.Xml.Linq;

namespace backend.Graders
{
    public class Grader
    {
        List<IExerciseGrader> Graders = new List<IExerciseGrader>
        {
            new MultipleChoiceGrader(),
            new TrueFalseGrader(),
        };

        public JsonElement GradeExercise(JsonElement documentWithSolution, JsonElement answers)
        {
            var editableDocument = JsonNode.Parse(documentWithSolution.GetRawText())![
                "exercise"
            ]!.AsArray();
            var answersArray = answers.GetProperty("answers");

            foreach (var exercise in editableDocument)
            {
                var exerciseId = exercise!.AsObject()["id"]!.ToString();
                var blocks = exercise!.AsObject()["blocks"]!.AsArray();

                foreach (var block in blocks)
                {
                    var metadata = block!.AsObject()["metadata"]!.AsObject();

                    if (!metadata.TryGetPropertyValue("solution", out var solution))
                    {
                        continue;
                    }

                    var answer = answersArray
                        .EnumerateArray()
                        .FirstOrDefault(a => a.GetProperty("id").GetString() == exerciseId);

                    var type = block["blockTemplate"]?.GetValue<string>();
                    var grader = Graders.FirstOrDefault(g => g.Type == type)!;

                    var feedbackElement = grader.Grade(
                        JsonDocument.Parse(solution!.ToJsonString()).RootElement,
                        answer
                    );
                    var feedbackNode = JsonNode.Parse(feedbackElement.GetRawText())!;
                    metadata["feedback"] = feedbackNode;

                    metadata.Remove("solution");
                }
            }

            return JsonSerializer.Deserialize<JsonElement>(editableDocument.ToJsonString())!;
        }
    }
}
