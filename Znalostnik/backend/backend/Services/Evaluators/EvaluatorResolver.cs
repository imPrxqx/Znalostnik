namespace backend.Services
{
    public class EvaluatorResolver : IEvaluatorResolver
    {
        private readonly IEnumerable<IAnswerEvaluator> _evaluators;

        public EvaluatorResolver(IEnumerable<IAnswerEvaluator> evaluators)
        {
            _evaluators = evaluators;
        }

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
