namespace backend.Algorithms
{
    public interface ISelectionAlgorithmResolver
    {
        ISelectionAlgorithm Resolve(string algorithmKey);
    }
}
