using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingApplicationsController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public TrainingApplicationsController(
            CollegeDbContext context)
        {
            _context = context;
        }

        // STUDENT: Apply for a training program
        [HttpPost("apply")]
        public async Task<ActionResult<TrainingApplication>>
            ApplyForTraining(TrainingApplication application)
        {
            // Check student
            var studentExists = await _context.Students
                .AnyAsync(student =>
                    student.Id == application.StudentId);

            if (!studentExists)
            {
                return BadRequest("Student does not exist.");
            }

            // Check training program
            var programExists = await _context.TrainingPrograms
                .AnyAsync(program =>
                    program.Id == application.TrainingProgramId &&
                    !program.IsDeleted);

            if (!programExists)
            {
                return BadRequest(
                    "Training program does not exist or is unavailable."
                );
            }

            // Prevent duplicate application
            var alreadyApplied =
                await _context.TrainingApplications
                    .AnyAsync(existing =>
                        existing.StudentId ==
                            application.StudentId &&
                        existing.TrainingProgramId ==
                            application.TrainingProgramId &&
                        !existing.IsDeleted
                    );

            if (alreadyApplied)
            {
                return Conflict(
                    "You have already applied for this training program."
                );
            }

            application.AppliedDate = DateTime.UtcNow;
            application.Status = "Applied";
            application.IsDeleted = false;

            _context.TrainingApplications.Add(application);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetApplication),
                new { id = application.Id },
                application
            );
        }

        // STUDENT: View only their own applications
        [HttpGet("student/{studentId:int}")]
        public async Task<ActionResult<IEnumerable<TrainingApplication>>>
            GetStudentApplications(int studentId)
        {
            var applications =
                await _context.TrainingApplications
                    .Where(application =>
                        application.StudentId == studentId &&
                        !application.IsDeleted
                    )
                    .ToListAsync();

            return Ok(applications);
        }

        // ADMIN/FACULTY: View one application
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TrainingApplication>>
            GetApplication(int id)
        {
            var application =
                await _context.TrainingApplications
                    .FirstOrDefaultAsync(application =>
                        application.Id == id &&
                        !application.IsDeleted
                    );

            if (application == null)
            {
                return NotFound();
            }

            return Ok(application);
        }

        // ADMIN/FACULTY: View all applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainingApplication>>>
            GetApplications()
        {
            var applications =
                await _context.TrainingApplications
                    .Where(application =>
                        !application.IsDeleted
                    )
                    .ToListAsync();

            return Ok(applications);
        }

        // ADMIN/FACULTY: Update application status
        [HttpPut("{id:int}")]
        public async Task<IActionResult>
            UpdateApplication(
                int id,
                TrainingApplication application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            var existingApplication =
                await _context.TrainingApplications
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        !item.IsDeleted
                    );

            if (existingApplication == null)
            {
                return NotFound();
            }

            existingApplication.Status =
                application.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ADMIN/FACULTY: Soft delete
        [HttpDelete("{id:int}")]
        public async Task<IActionResult>
            DeleteApplication(int id)
        {
            var application =
                await _context.TrainingApplications
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        !item.IsDeleted
                    );

            if (application == null)
            {
                return NotFound();
            }

            application.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ADMIN: View deleted applications
        [HttpGet("bin")]
        public async Task<ActionResult<IEnumerable<TrainingApplication>>>
            GetDeletedApplications()
        {
            var applications =
                await _context.TrainingApplications
                    .Where(application =>
                        application.IsDeleted
                    )
                    .ToListAsync();

            return Ok(applications);
        }

        // ADMIN: Restore
        [HttpPut("restore/{id:int}")]
        public async Task<IActionResult>
            RestoreApplication(int id)
        {
            var application =
                await _context.TrainingApplications
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        item.IsDeleted
                    );

            if (application == null)
            {
                return NotFound();
            }

            application.IsDeleted = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}