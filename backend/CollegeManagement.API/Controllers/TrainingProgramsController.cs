using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingProgramsController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public TrainingProgramsController(CollegeDbContext context)
        {
            _context = context;
        }


        // GET: api/trainingprograms
        // Only active programs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainingProgram>>>
            GetTrainingPrograms()
        {
            var programs = await _context.TrainingPrograms
                .Where(program => !program.IsDeleted)
                .ToListAsync();

            return Ok(programs);
        }


        // GET: api/trainingprograms/bin
        [HttpGet("bin")]
        public async Task<ActionResult<IEnumerable<TrainingProgram>>>
            GetDeletedTrainingPrograms()
        {
            var programs = await _context.TrainingPrograms
                .Where(program => program.IsDeleted)
                .ToListAsync();

            return Ok(programs);
        }


        // GET: api/trainingprograms/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TrainingProgram>>
            GetTrainingProgram(int id)
        {
            var program = await _context.TrainingPrograms
                .FirstOrDefaultAsync(program =>
                    program.Id == id && !program.IsDeleted
                );

            if (program == null)
            {
                return NotFound();
            }

            return Ok(program);
        }


        // POST: api/trainingprograms
        [HttpPost]
        public async Task<ActionResult<TrainingProgram>>
            CreateTrainingProgram(TrainingProgram program)
        {
            program.IsDeleted = false;

            _context.TrainingPrograms.Add(program);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetTrainingProgram),
                new { id = program.Id },
                program
            );
        }


        // PUT: api/trainingprograms/1
        [HttpPut("{id:int}")]
        public async Task<IActionResult>
            UpdateTrainingProgram(
                int id,
                TrainingProgram program)
        {
            if (id != program.Id)
            {
                return BadRequest();
            }

            var existingProgram =
                await _context.TrainingPrograms.FindAsync(id);

            if (existingProgram == null)
            {
                return NotFound();
            }

            existingProgram.Name = program.Name;
            existingProgram.Trainer = program.Trainer;
            existingProgram.Duration = program.Duration;
            existingProgram.StartDate = program.StartDate;
            existingProgram.Students = program.Students;
            existingProgram.Completion = program.Completion;
            existingProgram.Status = program.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/trainingprograms/1
        // Soft Delete
        [HttpDelete("{id:int}")]
        public async Task<IActionResult>
            DeleteTrainingProgram(int id)
        {
            var program =
                await _context.TrainingPrograms.FindAsync(id);

            if (program == null)
            {
                return NotFound();
            }

            program.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // PUT: api/trainingprograms/restore/1
        [HttpPut("restore/{id:int}")]
        public async Task<IActionResult>
            RestoreTrainingProgram(int id)
        {
            var program =
                await _context.TrainingPrograms.FindAsync(id);

            if (program == null)
            {
                return NotFound();
            }

            program.IsDeleted = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}