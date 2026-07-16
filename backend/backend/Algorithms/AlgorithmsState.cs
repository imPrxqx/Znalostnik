namespace backend.Algorithms
{
    /// <summary>
    /// Represents the current state of the algorithms used during session processing.
    /// Contains all algorithm specific state data for each algorithm, can be used for runtime switching algorithms.
    /// </summary>
    public class AlgorithmsState
    {
        /// <summary>
        /// Identifier of algorithm state
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Algorithm state used for Bayesian Knowledge Tracing.
        /// </summary>
        public BayesianState Bayesian { get; set; } = new();

        /// <summary>
        /// Algorithm state used for Thompson sampling.
        /// </summary>
        public ThompsonState Thompson { get; set; } = new();
    }
}
