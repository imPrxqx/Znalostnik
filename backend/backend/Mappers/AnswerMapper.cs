using System.Text.Json;
using backend.Models;

namespace backend.DTOs
{
    public static class AnswerMapper
    {
        public static AnswerDto ToAnswerDto(this Answer answer)
        {
            return new AnswerDto
            {
                Id = answer.Id,
                SubmissionId = answer.SubmissionId,
                Submit = JsonDocument.Parse(answer.Submit),
                CreatedAt = answer.CreatedAt,
                Status = answer.Status,
                CorrectPercentage = answer.CorrectPercentage,
                ActivityId = answer.ActivityId,
            };
        }

        public static AnswerDto ToAnswerDto(this RuntimeAnswer answer)
        {
            return new AnswerDto
            {
                Id = answer.Id,
                Submit = JsonDocument.Parse(answer.Submit),
                Status = answer.Status,
                Version = answer.Version,
                CorrectPercentage = answer.CorrectPercentage,
                CreatedAt = answer.CreatedAt,
                ActivityId = answer.ActivityId,
            };
        }
    }
}
