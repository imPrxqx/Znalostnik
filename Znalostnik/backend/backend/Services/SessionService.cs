using System;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;

namespace backend.Services
{
    public class SessionService : ISessionService
    {
        private readonly ISessionRepository _sessionRepository;

        public SessionService(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public async Task<SessionDto?> GetByIdAsync(UserDto user, Guid id)
        {
            var session = await _sessionRepository.GetByIdAsync(id);

            if (session == null || session.CreatedByUserId != user.Id)
            {
                return null;
            }

            return session.ToSessionDto();
        }

        public async Task<SessionDto> CreateAsync(UserDto user, CreateSessionDto dto)
        {
            var session = new Session
            {
                Title = dto.Title,
                IsPublic = dto.IsPublic,
                Status = dto.Status,
                AccessCode = dto.AccessCode,
                ExerciseId = dto.ExerciseId,
                CreatedByUserId = user.Id,
                CreatedAt = DateTime.UtcNow,
            };

            await _sessionRepository.AddAsync(session);
            return session.ToSessionDto();
        }

        public async Task<bool> UpdateAsync(UserDto user, UpdateSessionDto dto)
        {
            var session = await _sessionRepository.GetByIdAsync(dto.Id);

            if (session == null || session.CreatedByUserId != user.Id)
            {
                return false;
            }

            session.Title = dto.Title;
            session.IsPublic = dto.IsPublic;
            session.Status = dto.Status;

            await _sessionRepository.UpdateAsync(session);
            return true;
        }

        public async Task<bool> DeleteAsync(UserDto user, Guid id)
        {
            var session = await _sessionRepository.GetByIdAsync(id);

            if (session == null || session.CreatedByUserId != user.Id)
            {
                return false;
            }

            await _sessionRepository.DeleteAsync(id);
            return true;
        }
    }
}
