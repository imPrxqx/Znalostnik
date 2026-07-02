namespace backend.GameModes
{
    public interface IGameModeResolver
    {
        IGameMode Resolve(string key);
    }
}
