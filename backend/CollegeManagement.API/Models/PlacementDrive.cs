namespace CollegeManagement.API.Models
{
    public class PlacementDrive
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }

        public Company? CompanyDetails { get; set; }

        public string Role { get; set; } = string.Empty;

        public string Package { get; set; } = string.Empty;

        public int Openings { get; set; }

        public string Location { get; set; } = string.Empty;

        public string Eligibility { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public string Status { get; set; } = "Active";

        public bool IsDeleted { get; set; } = false;
    }
}