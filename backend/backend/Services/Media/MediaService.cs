using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class MediaService : IMediaService
    {
        private readonly ApplicationDbContext _context;

        public MediaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<MediaStreamDto>> GetMediaAsync(Guid mediaId)
        {
            var media = await _context.Medias.FirstOrDefaultAsync(x => x.Id == mediaId);

            if (media == null)
            {
                return Result<MediaStreamDto>.Failure(Errors.NotFound);
            }

            return Result<MediaStreamDto>.Success(media.ToMediaStreamDto());
        }

        public async Task<Result<IEnumerable<MediaDto>>> GetMediasAsync(UserDto user)
        {
            var medias = await _context
                .Medias.Where(x => x.CreatedByUserId == user.Id)
                .Select(x => x.ToMediaDto())
                .ToListAsync();

            return Result<IEnumerable<MediaDto>>.Success(medias);
        }

        public async Task<Result<MediaDto>> CreateMediaFileAsync(UserDto user, IFormFile file)
        {
            var path = Path.Combine("uploads");
            Directory.CreateDirectory(path);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(path, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            var media = new Media
            {
                FileName = file.FileName,
                Path = fullPath,
                ContentType = file.ContentType,
                CreatedByUserId = user.Id,
            };

            _context.Medias.Add(media);
            await _context.SaveChangesAsync();
            return Result<MediaDto>.Success(media.ToMediaDto());
        }

        public async Task<Result> DeleteMediaAsync(UserDto user, Guid mediaId)
        {
            var media = await _context.Medias.FirstOrDefaultAsync(x =>
                x.Id == mediaId && x.CreatedByUserId == user.Id
            );

            if (media == null)
            {
                return Result.Failure(Errors.NotFound);
            }

            var fullPath = Path.GetFullPath(media.Path);

            // Remove also file when removing metadata
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            _context.Remove(media);
            await _context.SaveChangesAsync();
            return Result.Success();
        }
    }
}
