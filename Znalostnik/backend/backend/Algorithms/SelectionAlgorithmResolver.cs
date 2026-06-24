namespace backend.Algorithms
{
    public class SelectionAlgorithmResolver : ISelectionAlgorithmResolver
    {
        private readonly IEnumerable<ISelectionAlgorithm> _algorithms;

        public SelectionAlgorithmResolver(IEnumerable<ISelectionAlgorithm> algorithms)
        {
            _algorithms = algorithms;
        }

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
