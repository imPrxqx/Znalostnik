namespace backend.Algorithms
{
    public class BayesianState
    {
        public List<ActivityBayesianKnowledge> Knowledges { get; set; } = new();
    }

    public class ActivityBayesianKnowledge
    {
        public string Id { get; set; } = null!;
        public double Knowledge { get; set; } = 0.1;
    }
}
