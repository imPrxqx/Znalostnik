using System;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using backend.DTOs;
using backend.Models;
using backend.Services.EmailSender;
using backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;

        public UserService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IEmailSender emailSender
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        public async Task<Result<User>> SignInAsGuestUser()
        {
            string id = $"guest_{Guid.NewGuid()}";

            var guestUser = new User
            {
                EmailConfirmed = true,
                UserName = id,
                Email = $"{id}@guest.com",
                UserType = UserType.Guest,
            };

            var result = await _userManager.CreateAsync(guestUser);

            if (!result.Succeeded)
            {
                Result<User>.Failure(Errors.InvalidOperation);
            }

            await _signInManager.SignInAsync(guestUser, true);

            return Result<User>.Success(guestUser);
        }

        public async Task<Result> ForgotPassword(UserForgotPasswordDto dto, string baseUrl)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
            {
                return Result.Success();
            }

            var isConfirmed = await _userManager.IsEmailConfirmedAsync(user);

            if (!isConfirmed)
            {
                return Result.Success();
            }

            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            // HTML code for creating link for frontend application
            var resetLink =
                $"{baseUrl}/authentication/reset-password?email={HtmlEncoder.Default.Encode(dto.Email)}&token={HtmlEncoder.Default.Encode(code)}";

            await _emailSender.SendEmailAsync(
                dto.Email,
                "Reset password",
                $"Click for reset password: <a href='{resetLink}'>Reset</a>"
            );

            return Result.Success();
        }

        public async Task<Result<UserDto>> GetUserAsync(ClaimsPrincipal userClaims)
        {
            var userId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Result<UserDto>.Failure(Errors.InvalidOperation);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Result<UserDto>.Failure(Errors.UserNotFound);
            }

            return Result<UserDto>.Success(user.ToUserDto());
        }

        public async Task<Result> DeleteUser(UserDto userDto)
        {
            var user = await _userManager.FindByIdAsync(userDto.Id);

            if (user == null)
            {
                return Result.Failure(Errors.UserNotFound);
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return Result.Failure(Errors.None);
            }

            return Result.Success();
        }

        public async Task<Result> UpdatePassword(UserDto userDto, UpdateUserPasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(userDto.Id);

            if (user == null)
            {
                return Result.Failure(Errors.UserNotFound);
            }

            var result = await _userManager.ChangePasswordAsync(
                user,
                dto.OldPassword,
                dto.NewPassword
            );

            if (!result.Succeeded)
            {
                return Result.Failure(Errors.None);
            }

            return Result.Success();
        }

        public async Task<Result> LogoutAsync()
        {
            await _signInManager.SignOutAsync();
            return Result.Success();
        }
    }
}
