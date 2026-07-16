using System.Text.Json;
using backend.Controllers;
using backend.Data;
using backend.DTOs;
using backend.Schemas;
using backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests
{
    public class ExerciseServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _dbOptions;

        public ExerciseServiceTests()
        {
            _dbOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestExerciseDb")
                .Options;
        }

        [Fact]
        public async Task CreateExerciseAsync_ShouldCreateExercise()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);

            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);

            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };

            var activityDto = new CreateExerciseDto { Title = "Test activity" };

            // Act
            var result = await activityService.CreateExerciseAsync(userDto, activityDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal("Test activity", result.Value.Title);
            var activityInDb = await context.Exercises.FirstOrDefaultAsync(a =>
                a.Id == result.Value.Id && a.Title == "Test activity"
            );
            Assert.NotNull(activityInDb);
            Assert.Equal("Test activity", activityInDb.Title);
        }

        [Fact]
        public async Task UpdateExerciseAsync_ShouldUpdateExercise()
        {
            // Arrange
            await using var context = new ApplicationDbContext(_dbOptions);
            var validator = new JsonSchemaValidator("Schemas");
            var activityService = new ExerciseService(context, validator);
            var userDto = new UserDto() { Id = Guid.NewGuid().ToString(), UserName = "Test" };
            var activityDto = new CreateExerciseDto { Title = "Original activity" };
            var created = await activityService.CreateExerciseAsync(userDto, activityDto);

            Assert.True(created.IsSuccess);
            // Act

            var updateDto = new UpdateExerciseDto { Title = "Updated title" };

            var updated = await activityService.UpdateExerciseAsync(
                userDto,
                created.Value.Id,
                updateDto
            );

            // Assert
            Assert.True(updated.IsSuccess);
            var inDb = await context
                .Exercises.Include(e => e.Activities)
                .FirstOrDefaultAsync(a => a.Id == created.Value.Id);
            Assert.NotNull(inDb);
            Assert.Equal("Updated title", inDb.Title);
            Assert.Empty(inDb.Activities);
        }

        [Fact]
        public async Task ValidateExerciseTaskAsync_ShouldValidate()
        {
            // Arrange
            var activityService = new JsonSchemaValidator("Schemas");
            var updateDto = new ActivityDTO
            {
                Id = Guid.NewGuid(),
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
                                "text": "3 barvami",
                                "style": {
                                    "fontFamily": "Arial",
                                    "fontSize": 64,
                                    "color": "#000000",
                                    "bold": false,
                                    "italic": false,
                                    "underline": false,
                                    "backgroundColor": "hsl(67, 70%, 85%)"
                                }
                            },
                            {
                                "id": "50dd1024-3165-47f1-8694-baa186e62fd3",
                                "text": "4 barvami",
                                "style": {
                                    "fontFamily": "Arial",
                                    "fontSize": 64,
                                    "color": "#000000",
                                    "bold": false,
                                    "italic": false,
                                    "underline": false,
                                    "backgroundColor": "hsl(104, 70%, 85%)"
                                }
                            },
                            {
                                "id": "daf9e2a4-7883-48df-9b14-403f76c910cb",
                                "text": "5 barvami",
                                "style": {
                                    "fontFamily": "Arial",
                                    "fontSize": 64,
                                    "color": "#000000",
                                    "bold": false,
                                    "italic": false,
                                    "underline": false,
                                    "backgroundColor": "hsl(139, 70%, 85%)"
                                }
                            },
                            {
                                "id": "8ea74437-026c-4d11-a20a-8d95dd638393",
                                "text": "6 barvami",
                                "style": {
                                    "fontFamily": "Arial",
                                    "fontSize": 64,
                                    "color": "#000000",
                                    "bold": false,
                                    "italic": false,
                                    "underline": false,
                                    "backgroundColor": "hsl(270, 70%, 85%)"
                                }
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
            };
            // Act
            var result = activityService.Validate(
                "Activities",
                updateDto.Type,
                updateDto.Content.RootElement.GetRawText()
            );
            var result1 = activityService.Validate(
                "Activities",
                "activity",
                updateDto.Style.RootElement.GetRawText()
            );
            var result2 = activityService.Validate(
                "Solutions",
                updateDto.Type,
                updateDto.Solution.RootElement.GetRawText()
            );

            // Assert
            Assert.True(result);
            Assert.True(result1);
            Assert.True(result2);
        }

        [Fact]
        public async Task ValidateExerciseTaskAsync_ShouldNotValidate()
        {
            // Arrange
            var activityService = new JsonSchemaValidator("Schemas");
            var updateDto = new ActivityDTO
            {
                Id = Guid.NewGuid(),
                Type = "quiz",
                Order = 0,
                Content = JsonDocument.Parse("{}"),
                Solution = JsonDocument.Parse("{}"),
            };

            // Act
            var result = activityService.Validate(
                "Activities",
                updateDto.Type,
                updateDto.Content.RootElement.GetRawText()
            );
            var result1 = activityService.Validate(
                "Solutions",
                updateDto.Type,
                updateDto.Solution.RootElement.GetRawText()
            );

            // Assert
            Assert.False(result);
            Assert.False(result1);
        }
    }
}
