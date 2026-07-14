namespace backend.Algorithms
{
    /// <summary>
    /// Resolves the selecting selection algorithm for selecting next activity.
    /// </summary>
    public class SelectionAlgorithmResolver : ISelectionAlgorithmResolver
    {
        private readonly IEnumerable<ISelectionAlgorithm> _algorithms;

        public SelectionAlgorithmResolver(IEnumerable<ISelectionAlgorithm> algorithms)
        {
            _algorithms = algorithms;
        }

        /// <summary>
        /// Returns a selection algorithm for selected algorithm type.
        /// </summary>
        /// <param name="key">Algorithm type</param>
        /// <returns>Algorithm for selecting activities</returns>
        /// <exception cref="InvalidOperationException">Throws when no algorithm exists for selected algorithm type</exception>
        public ISelectionAlgorithm Resolve(string key)
        {
            var mode = _algorithms.FirstOrDefault(x => x.AlgorithmType == key);

            if (mode == null)
            {
                throw new InvalidOperationException("Algorithm not found");
            }

            return mode;
        }
    }
}
