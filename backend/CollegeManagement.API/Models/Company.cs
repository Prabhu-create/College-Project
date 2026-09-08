namespace CollegeManagement.API.Models
{
    public class Company
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Website { get; set; } = string.Empty;

        public string Contact { get; set; } = string.Empty;

        public string Status { get; set; } = "Active";

        public bool IsDeleted { get; set; } = false;
    }
}