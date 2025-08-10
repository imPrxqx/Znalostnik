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
            if (!documentWithSolution.TryGetProperty("exercises", out var exercisesElement))
            {
                throw new Exception();
            }

            var editableDocument = JsonNode.Parse(exercisesElement.GetRawText())!.AsArray();
            var answersArray = answers.GetProperty("answers");

            foreach (var exercise in editableDocument)
            {
                var exerciseId = exercise!["id"]!.ToString();
                var blocks = exercise!["blocks"]!.AsArray();

                foreach (var block in blocks)
                {
                    var metadata = block!["metadata"]!.AsObject();

                    if (!metadata.TryGetPropertyValue("solution", out var solution))
                    {
                        continue;
                    }

                    var type = block["blockTemplate"]?.GetValue<string>();

                    var answer = answersArray
                        .EnumerateArray()
                        .FirstOrDefault(a =>
                            a.GetProperty("exerciseId").GetString() == exerciseId
                            && a.GetProperty("blockTemplate").GetString() == type
                        );

                    var grader = Graders.FirstOrDefault(g => g.Type == type)!;

                    JsonElement feedbackElement;

                    if (answer.ValueKind != JsonValueKind.Undefined)
                    {
                        feedbackElement = grader.Grade(
                            JsonDocument.Parse(solution!.ToJsonString()).RootElement,
                            answer
                        );
                    }
                    else
                    {
                        feedbackElement = grader.Grade(
                            JsonDocument.Parse(solution!.ToJsonString()).RootElement,
                            null
                        );
                    }

                    var feedbackNode = JsonNode.Parse(feedbackElement.GetRawText())!;
                    metadata["feedback"] = feedbackNode;

                    metadata.Remove("solution");
                }
            }

            var resultJson = new JsonObject { ["exercises"] = editableDocument };

            return JsonSerializer.Deserialize<JsonElement>(resultJson.ToJsonString())!;
        }
    }
}
