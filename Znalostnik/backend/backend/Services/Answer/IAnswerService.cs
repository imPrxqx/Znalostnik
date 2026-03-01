using System;
using System.Text.Json;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IAnswerService
    {
        Task<Result<AnswerDto>> UpdateAnswerAsync(CreateAnswerDto dto);
        Task<Result<IEnumerable<AnswerDto>>> GetAnswersForSubmissionAsync(Guid submissionId);
    }
}
