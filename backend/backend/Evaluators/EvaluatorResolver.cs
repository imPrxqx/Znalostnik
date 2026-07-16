namespace backend.Evaluators
{
    /// <summary>
    /// Resolves the selecting answer evaluator based on activity type
    /// </summary>
    public class EvaluatorResolver : IEvaluatorResolver
    {
        private readonly IEnumerable<IAnswerEvaluator> _evaluators;

        public EvaluatorResolver(IEnumerable<IAnswerEvaluator> evaluators)
        {
            _evaluators = evaluators;
        }

        /// <summary>
        /// Returns a evaluator for selected activity type.
        /// </summary>
        /// <param name="key">Activity type</param>
        /// <returns>Evaluator for activity type</returns>
        /// <exception cref="InvalidOperationException">When no evaluator exists for selected activity type</exception>
        public IAnswerEvaluator Resolve(string key)
        {
            var evaluator = _evaluators.FirstOrDefault(x => x.ExerciseActivityType == key);

            if (evaluator == null)
            {
                throw new InvalidOperationException("Evaluator not found");
            }

            return evaluator;
        }
    }
}
