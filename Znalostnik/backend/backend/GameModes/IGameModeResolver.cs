using backend.Evaluators;

namespace backend.GameModes
{
    /// <summary>
    /// Game mode resolver interface for selecting game mode by game mode ky.
    /// </summary>
    public interface IGameModeResolver
    {
        /// <summary>
        /// Returns a game mode for selected game mode.
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        IGameMode Resolve(string key);
    }
}
