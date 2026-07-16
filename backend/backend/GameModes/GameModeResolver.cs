using backend.Evaluators;

namespace backend.GameModes
{
    /// <summary>
    /// Resolves the selecting game mode based on game mode type
    /// </summary>
    public class GameModeResolver : IGameModeResolver
    {
        private readonly IEnumerable<IGameMode> _gameModes;

        public GameModeResolver(IEnumerable<IGameMode> gameModes)
        {
            _gameModes = gameModes;
        }

        /// <summary>
        /// Returns a game mode for selected game mode type.
        /// </summary>
        /// <param name="key">Game mode type</param>
        /// <returns>Game mode for game mode type</returns>
        /// <exception cref="InvalidOperationException">Throws when no game mode exists for selected game mode type</exception>
        public IGameMode Resolve(string key)
        {
            var mode = _gameModes.FirstOrDefault(x => x.GameModeType == key);

            if (mode == null)
            {
                throw new InvalidOperationException("Game mode not found");
            }

            return mode;
        }
    }
}
