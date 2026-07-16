namespace backend.Algorithms
{
    /// <summary>
    /// Represenets state of the Thompson Sampling algorithm.
    /// Stores for each activities probability distributions used for estimating success of activities.
    /// </summary>
    public class ThompsonState
    {
        public List<ThompsonActivityDistribution> Distributions { get; set; } = new();
    }

    /// <summary>
    /// Represents Beta probability distribution for selected activity.
    /// </summary>
    public class ThompsonActivityDistribution
    {
        public string Id { get; set; } = null!;
        public double Alpha { get; set; } = 1;
        public double Beta { get; set; } = 1;
    }
}
