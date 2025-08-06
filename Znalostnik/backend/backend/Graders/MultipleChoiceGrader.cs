using System.Text.Json;

namespace backend.Graders
{
    public class MultipleChoiceGrader : IExerciseGrader
    {
        public string Type => "multipleChoice";

        public JsonElement Grade(JsonElement solution, JsonElement answer)
        {
            throw new NotImplementedException();
        }
    }
}
