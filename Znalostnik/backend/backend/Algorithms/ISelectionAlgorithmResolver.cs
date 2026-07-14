namespace backend.Algorithms
{
    /// <summary>
    /// Selection algorithm resolver interface for selecting activities by algorithm key.
    /// </summary>
    public interface ISelectionAlgorithmResolver
    {
        /// <summary>
        /// Returns a selection algorithm for selected algorithm type.
        /// </summary>
        /// <param name="algorithmKey">Algorithm key</param>
        /// <returns>Selected selection algorithm</returns>
        ISelectionAlgorithm Resolve(string algorithmKey);
    }
}
