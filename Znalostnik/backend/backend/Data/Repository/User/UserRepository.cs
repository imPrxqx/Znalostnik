using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<User> _userManager;

        public UserRepository(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User> CreateTemporaryUserAsync()
        {
            var randomId = Guid.NewGuid();

            var user = new User
            {
                UserName = $"guest_{randomId}",
                Email = $"guest_{randomId}@temp.local",
                EmailConfirmed = true,
                LockoutEnabled = false,
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            await _userManager.AddToRoleAsync(user, "Guest");
            await _userManager.CreateAsync(user);

            return user;
        }

        public async Task DeleteTemporaryUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return;
            }

            var isGuest = await _userManager.IsInRoleAsync(user, "Guest");

            if (isGuest)
            {
                await _userManager.DeleteAsync(user);
            }
        }
    }
}
