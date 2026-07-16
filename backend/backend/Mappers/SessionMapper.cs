using backend.Models;

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
                Status = session.Status,
                CreatedAt = session.CreatedAt,
                RespondType = session.RespondType,
                GameMode = session.GameMode,
                AccessCode = session.AccessCode,
                ExerciseId = session.ExerciseId,
            };
        }

        public static SessionReportDto ToSessionReportDto(
            this Session session,
            List<ParticipantDto> participants,
            List<Activity> activities,
            List<Answer> answers
        )
        {
            return new SessionReportDto
            {
                Id = session.Id,
                Title = session.Title,
                RespondType = session.RespondType,
                Activities = activities.Select(a => a.ToActivityDto()).ToList(),
                Answers = answers.Select(a => a.ToAnswerDto()).ToList(),
                Participants = participants,
            };
        }

        public static SessionDto ToSessionDto(this RuntimeSession session)
        {
            return new SessionDto
            {
                Id = session.Id,
                Title = session.Title,
                Status = session.Status,
                RespondType = session.RespondType,
                CreatedAt = session.CreatedAt,
                GameMode = session.GameMode,
                GameSetting = session.GameSetting,
                AccessCode = session.AccessCode,
                ExerciseId = session.ExerciseId,
            };
        }
    }
}
