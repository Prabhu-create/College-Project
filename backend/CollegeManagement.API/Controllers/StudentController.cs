using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly CollegeDbContext _context;
        private readonly PasswordHasher<Student> _passwordHasher;

        public StudentsController(CollegeDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Student>();
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            var students = await _context.Students
        .Where(student => !student.IsDeleted)
        .ToListAsync();

            return Ok(students);
        }

        // GET: api/students/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }


     [HttpPost]
public async Task<ActionResult<Student>> CreateStudent(Student student)
{
    student.Status = student.CGPA >= 7.5m
        ? "Eligible"
        : "Not Eligible";

    // Hash password only when a password is provided
    if (!string.IsNullOrWhiteSpace(student.Password))
    {
        student.Password = _passwordHasher.HashPassword(
            student,
            student.Password
        );
    }
    else
    {
        student.Password = string.Empty;
    }

    _context.Students.Add(student);

    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetStudent),
        new { id = student.Id },
        student
    );
}

        // PUT: api/students/1
       [HttpPut("{id}")]
public async Task<IActionResult> UpdateStudent(
    int id,
    Student student)
{
    try
    {
        var existingStudent =
            await _context.Students.FindAsync(id);

        if (existingStudent == null)
        {
            return NotFound(new
            {
                message = $"Student with ID {id} not found."
            });
        }

        existingStudent.Name = student.Name;
        existingStudent.RegisterNumber = student.RegisterNumber;
        existingStudent.Department = student.Department;
        existingStudent.Year = student.Year;
        existingStudent.Email = student.Email;
        if (!string.IsNullOrWhiteSpace(student.Password))
{
    existingStudent.Password = _passwordHasher.HashPassword(
        existingStudent,
        student.Password
    );
}
        existingStudent.Phone = student.Phone;
        existingStudent.CGPA = student.CGPA;
        existingStudent.Skills = student.Skills;

        // Automatically calculate placement eligibility
        existingStudent.Status =
            existingStudent.CGPA >= 7.5m
                ? "Eligible"
                : "Not Eligible";

        await _context.SaveChangesAsync();

        return NoContent();
    }
    catch (Exception ex)
    {
        Console.WriteLine("UPDATE STUDENT ERROR:");
        Console.WriteLine(ex.ToString());

        return BadRequest(new
        {
            message = ex.Message,
            innerException = ex.InnerException?.Message
        });
    }
}

        // DELETE: api/students/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            student.IsDeleted = true;
          
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("bin")]
public async Task<ActionResult<IEnumerable<Student>>> GetDeletedStudents()
{
    var students = await _context.Students
        .Where(student => student.IsDeleted)
        .ToListAsync();

    return Ok(students);
}

[HttpPut("{id}/restore")]
public async Task<IActionResult> RestoreStudent(int id)
{
    var student = await _context.Students.FindAsync(id);

    if (student == null)
    {
        return NotFound();
    }

    student.IsDeleted = false;

    await _context.SaveChangesAsync();

    return NoContent();
}

[HttpPost("login")]
public async Task<IActionResult> StudentLogin(
    [FromBody] StudentLoginRequest request
)
{
    var student = await _context.Students
        .FirstOrDefaultAsync(student =>
            student.Email == request.Email &&
            !student.IsDeleted
        );

    if (student == null)
    {
        return Unauthorized(new
        {
            message = "Invalid email or password."
        });
    }

    var passwordResult = _passwordHasher.VerifyHashedPassword(
        student,
        student.Password,
        request.Password
    );

    if (passwordResult == PasswordVerificationResult.Failed)
    {
        return Unauthorized(new
        {
            message = "Invalid email or password."
        });
    }

    return Ok(new
    {
        id = student.Id,
        name = student.Name,
        email = student.Email,
        role = "Student"
    });
}

    }
}