using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public static class SessionMapper
    {
        public static SessionDto ToSessionDto(this Session session)
        {
            return new SessionDto
            {
                Id = session.Id,
                Title = session.Title,
                IsPublic = session.IsPublic,
                Status = session.Status,
                CreatedAt = session.CreatedAt,
                ExerciseId = session.ExerciseId,
            };
        }
    }
}
