using backend.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;

namespace backend.Data.Repository
{
    public interface IUserRepository
    {
        Task<User> CreateTemporaryUserAsync();
        Task DeleteTemporaryUserAsync(string userId);
    }
}
