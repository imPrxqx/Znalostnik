using System.ComponentModel.DataAnnotations;
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
        [Required]
        public string Email { get; set; } = string.Empty;
    }

    public class UpdateUserPasswordDto
    {
        [Required]
        public string OldPassword { get; set; } = string.Empty;

        [Required]
        public string NewPassword { get; set; } = string.Empty;
    }
}
