namespace CollegeManagement.API.Models
{
    public class Mark
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public string StudentName { get; set; } = string.Empty;

        public string RegisterNumber { get; set; } = string.Empty;

        public string Subject { get; set; } = string.Empty;

        public int Marks { get; set; }

        public string Percentage { get; set; } = string.Empty;

        public string Grade { get; set; } = string.Empty;
    }
}