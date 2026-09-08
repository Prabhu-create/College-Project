namespace CollegeManagement.API.Models
{
    public class Faculty
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string EmployeeId { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Designation { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;
    }
}