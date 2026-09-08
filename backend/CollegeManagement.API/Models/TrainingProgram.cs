namespace CollegeManagement.API.Models
{
    public class TrainingProgram
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Trainer { get; set; } = string.Empty;

        public string Duration { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public int Students { get; set; }

        public int Completion { get; set; }

        public string Status { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;
    }
}