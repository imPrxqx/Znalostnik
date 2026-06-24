using System.Text.Json;
using backend.Models;

namespace backend.Services
{
    public interface IAnswerEvaluator
    {
        string ExerciseActivityType { get; }
        void Evaluate(RuntimeActivity activity, RuntimeAnswer answer);
    }
}
