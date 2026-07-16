using System.Text.Json;
using backend.Data;
using backend.DTOs;
using backend.Evaluators;
using backend.GameModes;
using backend.Hubs;
using backend.Models;
using backend.Runtime;
using backend.Schemas;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests
{
    public class SessionServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _dbOptions;

        private readonly IHubContext<SessionHub> _hubContext;
        private readonly Mock<IGameModeResolver> _gameModes;
        private readonly Mock<IEvaluatorResolver> _evaluators;
        private readonly IRuntimeSessionStore _runtime;

        public SessionServiceTests()
        {
            _dbOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestSessionDb")
                .Options;

            var groupClient = new Mock<IClientProxy>();

            groupClient
                .Setup(x =>
                    x.SendCoreAsync(
                        It.IsAny<string>(),
                        It.IsAny<object[]>(),
                        It.IsAny<CancellationToken>()
                    )
                )
                .Returns(Task.CompletedTask);

            var clients = new Mock<IHubClients>();

            clients.Setup(x => x.Group(It.IsAny<string>())).Returns(groupClient.Object);

            var hubContext = new Mock<IHubContext<SessionHub>>();

            hubContext.Setup(x => x.Clients).Returns(clients.Object);

            _hubContext = hubContext.Object;

            _gameModes = new Mock<IGameModeResolver>();
            var fakeMode = new Mock<IGameMode>();

            fakeMode
                .Setup(x => x.ValidateStart(It.IsAny<RuntimeSession>(), It.IsAny<List<Guid>>()))
                .Returns(Result.Success());

            fakeMode
                .Setup(x => x.Start(It.IsAny<RuntimeSession>(), It.IsAny<List<Guid>>()))
                .Returns(new List<ActivityAssignment>());

            _gameModes.Setup(x => x.Resolve("classic")).Returns(fakeMode.Object);

            _evaluators = new Mock<IEvaluatorResolver>();
            _runtime = new RuntimeSessionStore();
        }

        [Fact]
        public async Task CreateSessionAsync_ShouldCreateSession()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var sessionService = new SessionService(
                context,
                _hubContext,
                _gameModes.Object,
                _evaluators.Object,
                _runtime,
                validator
            );

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Original activity" };
            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);

            // Act

            var updateDto = CreateUpdateExerciseDto();

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            Assert.True(updated.IsSuccess);

            var sessionDto = new CreateSessionDto
            {
                ExerciseId = created.Value.Id,
                Title = "Test activity",
                RespondType = "individual",
                GameMode = "classic",
            };

            // Act
            var result = await sessionService.CreateSessionAsync(userDto, sessionDto);

            // Assert
            Assert.True(result.IsSuccess);

            var inMemory = _runtime.GetSession(result.Value.Id);

            Assert.NotNull(inMemory);
            Assert.Equal(created.Value.Id, inMemory.ExerciseId);
            Assert.Equal("Test activity", inMemory.Title);
            Assert.Equal("individual", inMemory.RespondType);
            Assert.Equal("classic", inMemory.GameMode);
            Assert.Equal("lobby", inMemory.Status);
        }

        [Fact]
        public async Task StartSessionAsync_ShouldStartSession()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var sessionService = new SessionService(
                context,
                _hubContext,
                _gameModes.Object,
                _evaluators.Object,
                _runtime,
                validator
            );

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Original activity" };
            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);

            // Act
            var updateDto = CreateUpdateExerciseDto();

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            Assert.True(updated.IsSuccess);

            var sessionDto = new CreateSessionDto
            {
                ExerciseId = created.Value.Id,
                Title = "Test activity",
                RespondType = "individual",
                GameMode = "classic",
            };

            var result = await sessionService.CreateSessionAsync(userDto, sessionDto);

            Assert.True(result.IsSuccess);

            // Act
            var inMemory = _runtime.GetSession(result.Value.Id);

            Assert.NotNull(inMemory);

            var started = await sessionService.StartSessionAsync(userDto, result.Value.Id);

            // Assert

            Assert.True(started.IsSuccess);
            Assert.Equal("active", started.Value.Status);
        }

        [Fact]
        public async Task EndSessionAsync_ShouldEndSession()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var sessionService = new SessionService(
                context,
                _hubContext,
                _gameModes.Object,
                _evaluators.Object,
                _runtime,
                validator
            );

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Original activity" };
            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);

            // Act

            var updateDto = CreateUpdateExerciseDto();

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            Assert.True(updated.IsSuccess);

            var sessionDto = new CreateSessionDto
            {
                ExerciseId = created.Value.Id,
                Title = "Test activity",
                RespondType = "individual",
                GameMode = "classic",
            };

            var result = await sessionService.CreateSessionAsync(userDto, sessionDto);

            Assert.True(result.IsSuccess);

            // Act
            var inMemory = _runtime.GetSession(result.Value.Id);

            Assert.NotNull(inMemory);

            var started = await sessionService.EndSessionAsync(userDto, result.Value.Id);

            var notInMemory = _runtime.GetSession(result.Value.Id);

            Assert.Null(notInMemory);

            // Assert
            Assert.True(started.IsSuccess);
            Assert.Equal("finished", started.Value.Status);
            var inDb = await context.Sessions.FirstOrDefaultAsync(s => s.Id == started.Value.Id);
            Assert.NotNull(inDb);
            Assert.Equal("finished", inDb.Status);
        }

        [Fact]
        public async Task JoinSessionAsync_ShouldJoinSession()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var sessionService = new SessionService(
                context,
                _hubContext,
                _gameModes.Object,
                _evaluators.Object,
                _runtime,
                validator
            );

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Original activity" };

            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);

            var updateDto = CreateUpdateExerciseDto();

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            Assert.True(updated.IsSuccess);

            var sessionDto = new CreateSessionDto
            {
                ExerciseId = created.Value.Id,
                Title = "Test activity",
                RespondType = "individual",
                GameMode = "classic",
            };

            var result = await sessionService.CreateSessionAsync(userDto, sessionDto);

            Assert.True(result.IsSuccess);

            var anotherUserDto = new UserDto()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "TestNext",
            };

            var sessionUser = new CreateSessionUserDto()
            {
                AccessCode = result.Value.AccessCode,
                UserName = "TestUser",
            };

            // Act

            var started = await sessionService.JoinSessionAsync(anotherUserDto, sessionUser);

            // Assert
            Assert.NotNull(started);

            var joined = _runtime.GetSession(started.Value);
            Assert.NotNull(joined);
            Assert.NotNull(joined.SessionUsers.FirstOrDefault(s => s.UserId == anotherUserDto.Id));
        }

        [Fact]
        public async Task JoinSessionAsync_ShouldNotJoinSession()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var sessionService = new SessionService(
                context,
                _hubContext,
                _gameModes.Object,
                _evaluators.Object,
                _runtime,
                validator
            );

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Original activity" };
            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);

            var updateDto = CreateUpdateExerciseDto();

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            Assert.True(updated.IsSuccess);

            var sessionDto = new CreateSessionDto
            {
                ExerciseId = created.Value.Id,
                Title = "Test activity",
                RespondType = "individual",
                GameMode = "classic",
            };

            var result = await sessionService.CreateSessionAsync(userDto, sessionDto);

            Assert.True(result.IsSuccess);

            var anotherUserDto = new UserDto()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "TestNext",
            };

            var sessionUser = new CreateSessionUserDto()
            {
                AccessCode = "RANDOM_CANNOT_BE_CREATED",
                UserName = "TestUser",
            };

            // Act

            var started = await sessionService.JoinSessionAsync(anotherUserDto, sessionUser);

            // Assert
            Assert.True(started.IsFailure);
        }

        [Fact]
        public async Task CreateSessionAsync_ShouldNotCreateSession()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var sessionService = new SessionService(
                context,
                _hubContext,
                _gameModes.Object,
                _evaluators.Object,
                _runtime,
                validator
            );

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Original activity" };
            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);

            // Act

            var updateDto = new UpdateExerciseDto
            {
                Title = "Updated title",
                Activities = new List<CreateActivityDTO>(),
            };

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            Assert.True(updated.IsSuccess);

            var sessionDto = new CreateSessionDto
            {
                ExerciseId = created.Value.Id,
                Title = "Test activity",
                RespondType = "individual",
                GameMode = "classic",
            };

            // Act
            var result = await sessionService.CreateSessionAsync(userDto, sessionDto);

            // Assert
            Assert.False(result.IsSuccess);
        }

        private UpdateExerciseDto CreateUpdateExerciseDto()
        {
            return new UpdateExerciseDto
            {
                Title = "Updated title",
                Activities = new List<CreateActivityDTO>
                {
                    new CreateActivityDTO
                    {
                        Type = "quiz",
                        Order = 0,

                        Style = JsonDocument.Parse(
                            """
                            {
                                "borderRadius": 8,
                                "borderColor": "hsl(169, 70%, 30%)",
                                "backgroundColor": "hsl(82, 70%, 85%)"
                            }
                            """
                        ),

                        Content = JsonDocument.Parse(
                            """
                            {
                                "text": "Kolika barvami lze obarvit každý planární graf?",
                                "style": {
                                    "fontFamily": "Arial",
                                    "fontSize": 80,
                                    "color": "#000000",
                                    "bold": true,
                                    "italic": false,
                                    "underline": false
                                },
                                "options": [
                                    {
                                        "id": "549c00f7-becd-4fd8-a778-9ea7132ece64",
                                        "text": "3 barvami"
                                    },
                                    {
                                        "id": "50dd1024-3165-47f1-8694-baa186e62fd3",
                                        "text": "4 barvami"
                                    },
                                    {
                                        "id": "daf9e2a4-7883-48df-9b14-403f76c910cb",
                                        "text": "5 barvami"
                                    },
                                    {
                                        "id": "8ea74437-026c-4d11-a20a-8d95dd638393",
                                        "text": "6 barvami"
                                    }
                                ]
                            }
                            """
                        ),

                        Solution = JsonDocument.Parse(
                            """
                            {
                                "correct": [
                                    "50dd1024-3165-47f1-8694-baa186e62fd3",
                                    "daf9e2a4-7883-48df-9b14-403f76c910cb",
                                    "8ea74437-026c-4d11-a20a-8d95dd638393"
                                ]
                            }
                            """
                        ),
                    },
                },
            };
        }
    }
}
