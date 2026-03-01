using System;
using System.Text.Json;
using backend.Data.Repository;
using backend.DTOs;
using backend.Models;
using backend.Utils;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Schema;

namespace backend.Services
{
    public class AnswerService : IAnswerService
    {
        private readonly ISessionUserService _sessionUserService;
        private readonly ISubmissionService _submissionService;
        private readonly IAnswerRepository _answerRepository;

        public AnswerService(
            ISessionUserService sessionUserService,
            ISubmissionService submissionService,
            IAnswerRepository answerRepository
        )
        {
            _sessionUserService = sessionUserService;
            _submissionService = submissionService;
            _answerRepository = answerRepository;
        }

        public Task<Result<IEnumerable<AnswerDto>>> GetAnswersForSubmissionAsync(Guid submissionId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<AnswerDto>> UpdateAnswerAsync(CreateAnswerDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
