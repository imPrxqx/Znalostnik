using System.Text.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;

namespace backend.Schemas
{
    public class JsonSchemaValidator
    {
        private readonly Dictionary<string, JSchema> _schemas;

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
