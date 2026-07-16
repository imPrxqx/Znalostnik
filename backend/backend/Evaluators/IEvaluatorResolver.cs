namespace backend.Evaluators
{
    /// <summary>
    /// Evaluator resolver interface for selecting evaluator by activity type.
    /// </summary>
    public interface IEvaluatorResolver
    {
        /// <summary>
        /// Returns a evaluator for selected activity type.
        /// </summary>
        /// <param name="key">Activity type key</param>
        /// <returns>Evaluator for activity type</returns>
        IAnswerEvaluator Resolve(string key);
    }
}
