    namespace CollegeManagement.API.Models
    {
        public class Application
        {
            public int Id { get; set; }

            public int StudentId { get; set; }

            public string Student { get; set; } = string.Empty;

            public string RegisterNumber { get; set; } = string.Empty;

            public string Company { get; set; } = string.Empty;

            public string Role { get; set; } = string.Empty;

            public string Package { get; set; } = string.Empty;

            public DateTime AppliedDate { get; set; }

            public string Status { get; set; } = string.Empty;

            public bool IsDeleted { get; set; } = false;
        }
    }