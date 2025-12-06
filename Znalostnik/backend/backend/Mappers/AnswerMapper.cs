using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.DTOs
{
    public static class AnswerMapper
    {
        public static AnswerDto ToAnswerDto(this Answer answer)
        {
            return new AnswerDto
            {
                Id = answer.Id,
                AnswerSubmit = answer.AnswerSubmit,
                AnswerEvaluation = answer.AnswerEvaluation,
                CreatedAt = answer.CreatedAt,
                SubmissionId = answer.SubmissionId,
                TaskId = answer.TaskId,
            };
        }
    }
}
