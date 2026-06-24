namespace backend.Services
{
    public interface IEvaluatorResolver
    {
        IAnswerEvaluator Resolve(string key);
    }
}
