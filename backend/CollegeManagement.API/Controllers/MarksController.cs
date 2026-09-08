using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public MarksController(CollegeDbContext context)
        {
            _context = context;
        }

        // GET: api/marks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mark>>> GetMarks()
        {
            return await _context.Marks
                .OrderByDescending(mark => mark.Id)
                .ToListAsync();
        }

        // GET: api/marks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mark>> GetMark(int id)
        {
            var mark = await _context.Marks.FindAsync(id);

            if (mark == null)
            {
                return NotFound();
            }

            return mark;
        }

        // POST: api/marks
        [HttpPost]
        public async Task<ActionResult<Mark>> CreateMark(Mark mark)
        {
            _context.Marks.Add(mark);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetMark),
                new { id = mark.Id },
                mark
            );
        }

        // PUT: api/marks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMark(
            int id,
            Mark mark)
        {
            if (id != mark.Id)
            {
                return BadRequest();
            }

            var existingMark =
                await _context.Marks.FindAsync(id);

            if (existingMark == null)
            {
                return NotFound();
            }

            existingMark.StudentId = mark.StudentId;
            existingMark.StudentName = mark.StudentName;
            existingMark.RegisterNumber = mark.RegisterNumber;
            existingMark.Subject = mark.Subject;
            existingMark.Marks = mark.Marks;
            existingMark.Percentage = mark.Percentage;
            existingMark.Grade = mark.Grade;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/marks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMark(int id)
        {
            var mark = await _context.Marks.FindAsync(id);

            if (mark == null)
            {
                return NotFound();
            }

            _context.Marks.Remove(mark);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}