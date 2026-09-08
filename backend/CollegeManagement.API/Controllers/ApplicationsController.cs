using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public ApplicationsController(CollegeDbContext context)
        {
            _context = context;
        }


        // ==========================================
        // GET ACTIVE APPLICATIONS
        // GET: api/applications
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>>
            GetApplications()
        {
            var applications = await _context.Applications
                .Where(application => !application.IsDeleted)
                .ToListAsync();

            return Ok(applications);
        }


        // ==========================================
        // GET APPLICATION BY ID
        // GET: api/applications/1
        // ==========================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Application>>
            GetApplication(int id)
        {
            var application = await _context.Applications
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


        // ==========================================
        // CREATE APPLICATION
        // POST: api/applications
        // ==========================================

        [HttpPost]
        public async Task<ActionResult<Application>>
            CreateApplication(Application application)
        {
            application.IsDeleted = false;

            _context.Applications.Add(application);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetApplication),
                new { id = application.Id },
                application
            );
        }


        // ==========================================
        // UPDATE APPLICATION
        // PUT: api/applications/1
        // ==========================================

        [HttpPut("{id}")]
        public async Task<IActionResult>
            UpdateApplication(
                int id,
                Application application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            var existingApplication =
                await _context.Applications
                    .FirstOrDefaultAsync(applicationItem =>
                        applicationItem.Id == id &&
                        !applicationItem.IsDeleted
                    );

            if (existingApplication == null)
            {
                return NotFound();
            }

            existingApplication.StudentId =
                application.StudentId;

            existingApplication.Student =
                application.Student;

            existingApplication.RegisterNumber =
                application.RegisterNumber;

            existingApplication.Company =
                application.Company;

            existingApplication.Role =
                application.Role;

            existingApplication.Package =
                application.Package;

            existingApplication.AppliedDate =
                application.AppliedDate;

            existingApplication.Status =
                application.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // ==========================================
        // SOFT DELETE APPLICATION
        // DELETE: api/applications/1
        // ==========================================

        [HttpDelete("{id}")]
        public async Task<IActionResult>
            DeleteApplication(int id)
        {
            var application =
                await _context.Applications
                    .FirstOrDefaultAsync(applicationItem =>
                        applicationItem.Id == id &&
                        !applicationItem.IsDeleted
                    );

            if (application == null)
            {
                return NotFound();
            }

            // Soft Delete
            application.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // ==========================================
        // GET DELETED APPLICATIONS
        // GET: api/applications/bin
        // ==========================================

        [HttpGet("bin")]
        public async Task<ActionResult<IEnumerable<Application>>>
            GetDeletedApplications()
        {
            var deletedApplications =
                await _context.Applications
                    .Where(application =>
                        application.IsDeleted
                    )
                    .ToListAsync();

            return Ok(deletedApplications);
        }


        // ==========================================
        // RESTORE APPLICATION
        // PUT: api/applications/1/restore
        // ==========================================

        [HttpPut("{id}/restore")]
        public async Task<IActionResult>
            RestoreApplication(int id)
        {
            var application =
                await _context.Applications
                    .FirstOrDefaultAsync(applicationItem =>
                        applicationItem.Id == id &&
                        applicationItem.IsDeleted
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