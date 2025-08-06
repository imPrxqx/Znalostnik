using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace backend.Models
{
    public class Exercise
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Content { get; set; } = "";

        private JsonElement StripSolutions(JsonElement exerciseDocument)
        {
            var node = JsonNode.Parse(exerciseDocument.GetRawText())!;

            foreach (var exercise in node["exercises"]!.AsArray())
            {
                foreach (var block in exercise!["blocks"]!.AsArray())
                {
                    var metadata = block!["metadata"]!.AsObject();
                    metadata.Remove("solution");
                }
            }

            return JsonSerializer.Deserialize<JsonElement>(node.ToJsonString());
        }
    }
}
