using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class ExercisesController : Controller
    {
        private ApplicationDbContext _context;

        public ExercisesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Exercises
        public async Task<IActionResult> Index()
        {
            var exercises = await _context.Exercises.ToListAsync();
            return Ok(exercises);
        }

        // GET: Exercises/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            var exercise = await _context.Exercises.FindAsync(id);

            if (exercise == null)
            {
                return NotFound();
            }

            return Ok(exercise);
        }

        // POST: Exercises/Create
        [HttpPost]
        public IActionResult CreateExercise(string exerciseDocument)
        {
            var exercise = new Exercise { Content = exerciseDocument };

            _context.Exercises.Add(exercise);

            return Ok(new { ExerciseId = exercise.Id });
        }
    }
}
