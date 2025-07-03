using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Test
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;

    }
}
