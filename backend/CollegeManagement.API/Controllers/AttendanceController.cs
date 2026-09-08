using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public AttendanceController(CollegeDbContext context)
        {
            _context = context;
        }

        // GET: api/attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendance()
        {
            var attendance = await _context.Attendances
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return Ok(attendance);
        }

        // GET: api/attendance/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendanceById(int id)
        {
            var attendance = await _context.Attendances
                .FindAsync(id);

            if (attendance == null)
            {
                return NotFound();
            }

            return Ok(attendance);
        }

        // POST: api/attendance
        [HttpPost]
        public async Task<ActionResult<Attendance>> CreateAttendance(
            Attendance attendance)
        {
            _context.Attendances.Add(attendance);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetAttendanceById),
                new { id = attendance.Id },
                attendance
            );
        }

        // PUT: api/attendance/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttendance(
            int id,
            Attendance attendance)
        {
            if (id != attendance.Id)
            {
                return BadRequest();
            }

            var existingAttendance =
                await _context.Attendances.FindAsync(id);

            if (existingAttendance == null)
            {
                return NotFound();
            }

            existingAttendance.StudentId =
                attendance.StudentId;

            existingAttendance.Date =
                attendance.Date;

            existingAttendance.Status =
                attendance.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/attendance/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var attendance =
                await _context.Attendances.FindAsync(id);

            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}