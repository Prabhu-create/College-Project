using CollegeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CollegeManagement.API.Data
{
    public class CollegeDbContext : DbContext
    {
        public CollegeDbContext(DbContextOptions<CollegeDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }

        public DbSet<PlacementDrive> PlacementDrives { get; set; }

        public DbSet<TrainingProgram> TrainingPrograms { get; set; }

        public DbSet<TrainingApplication> TrainingApplications { get; set; }

        public DbSet<Application> Applications { get; set; }

        public DbSet<Attendance> Attendances { get; set; }

        public DbSet<Mark> Marks { get; set; }

        public DbSet<Faculty> Faculties { get; set; }

        public DbSet<Company> Companies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>()
                .Property(student => student.CGPA)
                .HasPrecision(3, 1);

            modelBuilder.Entity<PlacementDrive>()
                .HasOne(drive => drive.CompanyDetails)
                .WithMany()
                .HasForeignKey(drive => drive.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}