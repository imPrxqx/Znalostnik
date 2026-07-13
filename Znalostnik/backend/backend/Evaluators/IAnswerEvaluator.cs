using System.Text.Json;
using backend.Models;

namespace backend.Evaluators
{
    /// <summary>
    /// Answer evaluator interface for evaluating answer based on activity type
    /// </summary>
    public interface IAnswerEvaluator
    {
        /// <summary>
        /// Activity type which is evaluator used for.
        /// </summary>
        string ExerciseActivityType { get; }

        /// <summary>
        /// Evaluates the submitted answer and updates answer with correct percentile.
        /// </summary>
        /// <param name="activity">Activity with solution</param>
        /// <param name="answer">Submitted answer</param>
        void Evaluate(RuntimeActivity activity, RuntimeAnswer answer);
    }
}
