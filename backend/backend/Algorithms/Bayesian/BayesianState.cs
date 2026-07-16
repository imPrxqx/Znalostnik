namespace backend.Algorithms
{
    /// <summary>
    /// Represenets state of the Bayesian Knowledge Tracing algorithm.
    /// Stores for each activities current probality knowledge.
    /// </summary>
    public class BayesianState
    {
        public List<ActivityBayesianKnowledge> Knowledges { get; set; } = new();
    }

    /// <summary>
    /// Represents estimated probality knowledge for selected activity.
    /// </summary>
    public class ActivityBayesianKnowledge
    {
        public string Id { get; set; } = null!;
        public double Knowledge { get; set; } = 0.1;
    }
}
