using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Humanizer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseController : ControllerBase
    {
        private ApplicationDbContext _context;

        public ExerciseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Exercises
        [HttpGet]
        public async Task<IActionResult> Exercises()
        {
            var exercises = await _context.Exercises.ToListAsync();
            return Ok(exercises);
        }

        // GET: Exercises/Exercise/5
        [HttpGet("{exerciseId}")]
        public async Task<IActionResult> Exercise(string exerciseId)
        {
            var exercise = await _context.Exercises.FindAsync(exerciseId);

            if (exercise == null)
            {
                return NotFound();
            }

            return Ok(exercise);
        }

        // POST: Exercises/CreateExercise
        [HttpPost]
        public IActionResult CreateExercise([FromBody] Dictionary<string, string> exerciseData)
        {
            if (
                exerciseData == null
                || !exerciseData.TryGetValue("exerciseDocument", out var exerciseDocument)
            )
            {
                return BadRequest("exerciseDocument is required.");
            }

            var exercise = new Exercise { Content = exerciseDocument };

            _context.Exercises.Add(exercise);
            _context.SaveChanges();

            return Ok(new { ExerciseId = exercise.Id });
        }
    }
}
