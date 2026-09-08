using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollegeManagement.API.Migrations
{
    public partial class AddIsDeletedToTrainingPrograms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // IsDeleted columns already exist in the database.
            // Nothing needs to be added here.
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Nothing to remove because the columns were created manually.
        }
    }
}