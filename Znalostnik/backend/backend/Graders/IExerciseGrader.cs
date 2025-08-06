using System.Text.Json;
using System.Text.Json.Nodes;

namespace backend.Graders
{
    public interface IExerciseGrader
    {
        string Type { get; }
        JsonElement Grade(JsonElement solution, JsonElement answer);
    }
}
