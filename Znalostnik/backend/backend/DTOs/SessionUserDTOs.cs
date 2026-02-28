using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class SessionUserDto
    {
        public Guid Id { get; set; }
        public Guid SessionId { get; set; }
        public Guid? TeamId { get; set; }
        public string UserName { get; set; } = string.Empty;
    }
}
