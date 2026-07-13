using System.Text.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;

namespace backend.Schemas
{
    /// <summary>
    /// Json validator with loaded json schemas from folder.
    /// </summary>
    public class JsonSchemaValidator
    {
        private readonly Dictionary<string, JSchema> _schemas;

        /// <summary>
        /// Loads all json schemas from the specified folder.
        /// </summary>
        /// <param name="schemaFolder"></param>
        public JsonSchemaValidator(string schemaFolder)
        {
            _schemas = Directory
                .GetFiles(schemaFolder, "*.json", SearchOption.AllDirectories)
                .ToDictionary(
                    f =>
                        Path.GetRelativePath(schemaFolder, f)
                            .Replace("\\", "/")
                            .Replace(".json", ""),
                    f => JSchema.Parse(File.ReadAllText(f))
                );
        }

        /// <summary>
        /// Validates json data on json schema.
        /// </summary>
        /// <param name="schemaGroup">Group schema name</param>
        /// <param name="schemaName">Schema name</param>
        /// <param name="json">Json data</param>
        /// <returns>Is json data valid on json schema</returns>
        /// <exception cref="KeyNotFoundException">Throws when json schema does not exists</exception>
        public bool Validate(string schemaGroup, string schemaName, string json)
        {
            var key = $"{schemaGroup}/{schemaName}";

            if (!_schemas.TryGetValue(key, out var schema))
            {
                throw new KeyNotFoundException(key);
            }

            var token = JToken.Parse(json);
            return token.IsValid(schema);
        }
    }
}
