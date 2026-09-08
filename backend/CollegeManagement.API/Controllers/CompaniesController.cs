using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public CompaniesController(CollegeDbContext context)
        {
            _context = context;
        }

        // GET: api/companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            var companies = await _context.Companies
                .Where(company => !company.IsDeleted)
                .OrderByDescending(company => company.Id)
                .ToListAsync();

            return Ok(companies);
        }

        // GET: api/companies/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Company>> GetCompany(int id)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(company =>
                    company.Id == id &&
                    !company.IsDeleted
                );

            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        // POST: api/companies
        [HttpPost]
        public async Task<ActionResult<Company>> CreateCompany(
            Company company)
        {
            company.IsDeleted = false;

            _context.Companies.Add(company);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCompany),
                new { id = company.Id },
                company
            );
        }

        // PUT: api/companies/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCompany(
            int id,
            Company company)
        {
            if (id != company.Id)
            {
                return BadRequest();
            }

            var existingCompany =
                await _context.Companies
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        !item.IsDeleted
                    );

            if (existingCompany == null)
            {
                return NotFound();
            }

            existingCompany.Name = company.Name;
            existingCompany.Industry = company.Industry;
            existingCompany.Location = company.Location;
            existingCompany.Website = company.Website;
            existingCompany.Contact = company.Contact;
            existingCompany.Status = company.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/companies/5
        // Soft Delete
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var company =
                await _context.Companies
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        !item.IsDeleted
                    );

            if (company == null)
            {
                return NotFound();
            }

            company.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/companies/bin
        [HttpGet("bin")]
        public async Task<ActionResult<IEnumerable<Company>>>
            GetDeletedCompanies()
        {
            var companies = await _context.Companies
                .Where(company => company.IsDeleted)
                .OrderByDescending(company => company.Id)
                .ToListAsync();

            return Ok(companies);
        }

        // PUT: api/companies/restore/5
        [HttpPut("restore/{id:int}")]
        public async Task<IActionResult> RestoreCompany(int id)
        {
            var company = await _context.Companies
                .FirstOrDefaultAsync(
                    company =>
                        company.Id == id &&
                        company.IsDeleted
                );

            if (company == null)
            {
                return NotFound();
            }

            company.IsDeleted = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}