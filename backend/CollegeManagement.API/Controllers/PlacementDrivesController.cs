using CollegeManagement.API.Data;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlacementDrivesController : ControllerBase
    {
        private readonly CollegeDbContext _context;

        public PlacementDrivesController(CollegeDbContext context)
        {
            _context = context;
        }

        // GET: api/placementdrives
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlacementDrive>>>
            GetPlacementDrives()
        {
            var drives = await _context.PlacementDrives
                .Include(drive => drive.CompanyDetails)
                .Where(drive => !drive.IsDeleted)
                .ToListAsync();

            return Ok(drives);
        }

        // GET: api/placementdrives/bin
        [HttpGet("bin")]
        public async Task<ActionResult<IEnumerable<PlacementDrive>>>
            GetDeletedPlacementDrives()
        {
            var drives = await _context.PlacementDrives
                .Include(drive => drive.CompanyDetails)
                .Where(drive => drive.IsDeleted)
                .ToListAsync();

            return Ok(drives);
        }

        // GET: api/placementdrives/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PlacementDrive>>
            GetPlacementDrive(int id)
        {
            var drive = await _context.PlacementDrives
                .Include(drive => drive.CompanyDetails)
                .FirstOrDefaultAsync(drive =>
                    drive.Id == id &&
                    !drive.IsDeleted
                );

            if (drive == null)
            {
                return NotFound();
            }

            return Ok(drive);
        }

        // POST: api/placementdrives
        [HttpPost]
        public async Task<ActionResult<PlacementDrive>>
            CreatePlacementDrive(PlacementDrive drive)
        {
            var companyExists = await _context.Companies
                .AnyAsync(company =>
                    company.Id == drive.CompanyId &&
                    !company.IsDeleted
                );

            if (!companyExists)
            {
                return BadRequest("Selected company does not exist.");
            }

            drive.IsDeleted = false;

            _context.PlacementDrives.Add(drive);

            await _context.SaveChangesAsync();

            await _context.Entry(drive)
                .Reference(item => item.CompanyDetails)
                .LoadAsync();

            return CreatedAtAction(
                nameof(GetPlacementDrive),
                new { id = drive.Id },
                drive
            );
        }

        // PUT: api/placementdrives/1
        [HttpPut("{id:int}")]
        public async Task<IActionResult>
            UpdatePlacementDrive(
                int id,
                PlacementDrive drive)
        {
            if (id != drive.Id)
            {
                return BadRequest();
            }

            var existingDrive =
                await _context.PlacementDrives
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        !item.IsDeleted
                    );

            if (existingDrive == null)
            {
                return NotFound();
            }

            var companyExists = await _context.Companies
                .AnyAsync(company =>
                    company.Id == drive.CompanyId &&
                    !company.IsDeleted
                );

            if (!companyExists)
            {
                return BadRequest("Selected company does not exist.");
            }

            existingDrive.CompanyId = drive.CompanyId;
            existingDrive.Role = drive.Role;
            existingDrive.Package = drive.Package;
            existingDrive.Openings = drive.Openings;
            existingDrive.Location = drive.Location;
            existingDrive.Eligibility = drive.Eligibility;
            existingDrive.Date = drive.Date;
            existingDrive.Status = drive.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/placementdrives/1
        [HttpDelete("{id:int}")]
        public async Task<IActionResult>
            DeletePlacementDrive(int id)
        {
            var drive =
                await _context.PlacementDrives
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        !item.IsDeleted
                    );

            if (drive == null)
            {
                return NotFound();
            }

            drive.IsDeleted = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/placementdrives/restore/1
        [HttpPut("restore/{id:int}")]
        public async Task<IActionResult>
            RestorePlacementDrive(int id)
        {
            var drive =
                await _context.PlacementDrives
                    .FirstOrDefaultAsync(item =>
                        item.Id == id &&
                        item.IsDeleted
                    );

            if (drive == null)
            {
                return NotFound();
            }

            drive.IsDeleted = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}