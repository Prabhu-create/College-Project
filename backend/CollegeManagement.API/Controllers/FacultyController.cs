using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public FacultyController(CollegeDbContext context)
        {
            _context = context;
        }

        // GET: api/faculty
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Faculty>>> GetFaculty()
        {
            return await _context.Faculties
                .Where(faculty => !faculty.IsDeleted)
                .OrderByDescending(faculty => faculty.Id)
                .ToListAsync();
        }

        // GET: api/faculty/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Faculty>> GetFacultyById(int id)
        {
            var faculty = await _context.Faculties
                .FirstOrDefaultAsync(f =>
                    f.Id == id && !f.IsDeleted
                );

            if (faculty == null)
            {
                return NotFound();
            }

            return Ok(faculty);
        }

        // POST: api/faculty
        [HttpPost]
        public async Task<ActionResult<Faculty>> CreateFaculty(Faculty faculty)
        {
            faculty.IsDeleted = false;

            _context.Faculties.Add(faculty);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetFacultyById),
                new { id = faculty.Id },
                faculty
            );
        }

        // PUT: api/faculty/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFaculty(
            int id,
            Faculty faculty)
        {
            if (id != faculty.Id)
            {
                return BadRequest();
            }

            var existingFaculty =
                await _context.Faculties.FindAsync(id);

            if (existingFaculty == null)
            {
                return NotFound();
            }

            existingFaculty.Name = faculty.Name;
            existingFaculty.EmployeeId = faculty.EmployeeId;
            existingFaculty.Department = faculty.Department;
            existingFaculty.Email = faculty.Email;
            existingFaculty.Phone = faculty.Phone;
            existingFaculty.Designation = faculty.Designation;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/faculty/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            var faculty =
                await _context.Faculties.FindAsync(id);

            if (faculty == null)
            {
                return NotFound();
            }

            faculty.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/faculty/bin
        [HttpGet("bin")]
        public async Task<ActionResult<IEnumerable<Faculty>>> GetDeletedFaculty()
        {
            return await _context.Faculties
                .Where(faculty => faculty.IsDeleted)
                .OrderByDescending(faculty => faculty.Id)
                .ToListAsync();
        }

        // PUT: api/faculty/restore/5
        [HttpPut("restore/{id}")]
        public async Task<ActionResult<Faculty>> RestoreFaculty(int id)
        {
            var faculty = await _context.Faculties
                .FirstOrDefaultAsync(f =>
                    f.Id == id && f.IsDeleted
                );

            if (faculty == null)
            {
                return NotFound();
            }

            faculty.IsDeleted = false;

            await _context.SaveChangesAsync();

            return Ok(faculty);
        }
    }
}