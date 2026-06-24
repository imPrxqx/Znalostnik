namespace backend.Algorithms
{
    public class AlgorithmsState
    {
        public Guid Id { get; set; }
        public BayesianState Bayesian { get; set; } = new();
        public ThompsonState Thompson { get; set; } = new();
    }
}
