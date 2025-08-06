using System.Text.Json;

namespace backend.Graders
{
    public class TrueFalseGrader : IExerciseGrader
    {
        public string Type => "trueFalse";

        public JsonElement Grade(JsonElement solution, JsonElement answer)
        {
            throw new NotImplementedException();
        }
    }
}
