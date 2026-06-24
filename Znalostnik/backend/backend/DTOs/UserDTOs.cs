using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public UserType UserType { get; set; }
    }

    public class UserForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class UpdateUserPasswordDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
