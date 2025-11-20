using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string? UserName { get; set; }
    }

    public class UserDetailDto
    {
        public string Id { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
