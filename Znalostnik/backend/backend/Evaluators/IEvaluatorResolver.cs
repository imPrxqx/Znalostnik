namespace backend.Evaluators
{
    public interface IEvaluatorResolver
    {
        IAnswerEvaluator Resolve(string key);
    }
}
