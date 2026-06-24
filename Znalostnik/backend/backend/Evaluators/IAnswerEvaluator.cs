using System.Text.Json;
using backend.Models;

namespace backend.Evaluators
{
    public interface IAnswerEvaluator
    {
        string ExerciseActivityType { get; }
        void Evaluate(RuntimeActivity activity, RuntimeAnswer answer);
    }
}
