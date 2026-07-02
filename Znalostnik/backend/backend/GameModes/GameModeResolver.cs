namespace backend.GameModes
{
    public class GameModeResolver : IGameModeResolver
    {
        private readonly IEnumerable<IGameMode> _gameModes;

        public GameModeResolver(IEnumerable<IGameMode> gameModes)
        {
            _gameModes = gameModes;
        }

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
