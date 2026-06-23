using backend.DTOs;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public interface IMediaService
    {
        Task<Result<IEnumerable<MediaDto>>> GetMediasAsync(UserDto user);
        Task<Result<MediaStreamDto>> GetMediaAsync(Guid mediaId);
        Task<Result<MediaDto>> CreateMediaFileAsync(UserDto user, IFormFile file);
        Task<Result> DeleteMediaAsync(UserDto user, Guid mediaId);
    }
}
