using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollegeManagement.API.Migrations
{
    public partial class NormalizeCompaniesAndPlacementDrives : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ---------------------------------------------------------
            // 1. Add new Company fields
            // ---------------------------------------------------------

            migrationBuilder.AddColumn<string>(
                name: "Website",
                
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Contact",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");


            // ---------------------------------------------------------
            // 2. Add CompanyId temporarily as nullable
            // ---------------------------------------------------------

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "PlacementDrives",
                type: "int",
                nullable: true);


            // ---------------------------------------------------------
            // 3. Convert old Company names to CompanyId
            // ---------------------------------------------------------

            migrationBuilder.Sql(@"
                UPDATE PlacementDrives
                SET CompanyId = Companies.Id
                FROM PlacementDrives
                INNER JOIN Companies
                    ON LTRIM(RTRIM(PlacementDrives.Company))
                    = LTRIM(RTRIM(Companies.Name));
            ");


            // ---------------------------------------------------------
            // 4. Stop migration if any drive could not be matched
            // ---------------------------------------------------------

            migrationBuilder.Sql(@"
                IF EXISTS (
                    SELECT 1
                    FROM PlacementDrives
                    WHERE CompanyId IS NULL
                )
                BEGIN
                    THROW 50001,
                        'Migration stopped: one or more PlacementDrives could not be matched to a Company.',
                        1;
                END
            ");


            // ---------------------------------------------------------
            // 5. Make CompanyId required
            // ---------------------------------------------------------

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "PlacementDrives",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);


            // ---------------------------------------------------------
            // 6. Add CompanyId foreign key
            // ---------------------------------------------------------

            migrationBuilder.CreateIndex(
                name: "IX_PlacementDrives_CompanyId",
                table: "PlacementDrives",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlacementDrives_Companies_CompanyId",
                table: "PlacementDrives",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);


            // ---------------------------------------------------------
            // 7. Remove old company string
            // ---------------------------------------------------------

            migrationBuilder.DropColumn(
                name: "Company",
                table: "PlacementDrives");


            // ---------------------------------------------------------
            // 8. Remove Students from PlacementDrive
            // ---------------------------------------------------------

            migrationBuilder.DropColumn(
                name: "Students",
                table: "PlacementDrives");


            // ---------------------------------------------------------
            // 9. Remove Openings from Company
            // ---------------------------------------------------------

            migrationBuilder.DropColumn(
                name: "Openings",
                table: "Companies");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Restore Companies.Openings
            migrationBuilder.AddColumn<int>(
                name: "Openings",
                table: "Companies",
                type: "int",
                nullable: false,
                defaultValue: 0);


            // Restore PlacementDrive.Students
            migrationBuilder.AddColumn<int>(
                name: "Students",
                table: "PlacementDrives",
                type: "int",
                nullable: false,
                defaultValue: 0);


            // Restore old Company column
            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "PlacementDrives",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");


            // Restore company names
            migrationBuilder.Sql(@"
                UPDATE PlacementDrives
                SET Company = Companies.Name
                FROM PlacementDrives
                INNER JOIN Companies
                    ON PlacementDrives.CompanyId = Companies.Id;
            ");


            migrationBuilder.DropForeignKey(
                name: "FK_PlacementDrives_Companies_CompanyId",
                table: "PlacementDrives");

            migrationBuilder.DropIndex(
                name: "IX_PlacementDrives_CompanyId",
                table: "PlacementDrives");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "PlacementDrives");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Contact",
                table: "Companies");
        }
    }
}