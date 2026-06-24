namespace backend.Algorithms
{
    public class ThompsonState
    {
        public List<ActivityThompsonKnowledge> Knowledges { get; set; } = new();
    }

    public class ActivityThompsonKnowledge
    {
        public string Id { get; set; } = null!;
        public double Alpha { get; set; } = 1;
        public double Beta { get; set; } = 1;
    }
}
