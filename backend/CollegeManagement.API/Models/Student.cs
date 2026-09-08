namespace CollegeManagement.API.Models
{
    public class Student
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string RegisterNumber { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;

        public string Year { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public decimal CGPA { get; set; }

        public string Skills { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;
    }
}