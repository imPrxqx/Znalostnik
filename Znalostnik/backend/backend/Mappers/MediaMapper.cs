using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public static class MediaMapper
    {
        public static MediaDto ToMediaDto(this Media media)
        {
            return new MediaDto
            {
                Id = media.Id,
                FileName = media.FileName,
                ContentType = media.ContentType,
                CreatedAt = media.CreatedAt,
            };
        }

        public static MediaStreamDto ToMediaStreamDto(this Media media)
        {
            return new MediaStreamDto
            {
                FileName = media.FileName,
                ContentType = media.ContentType,
                Path = media.Path,
            };
        }
    }
}
