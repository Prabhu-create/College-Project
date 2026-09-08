namespace CollegeManagement.API.Models
{
    public class TrainingApplication
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int TrainingProgramId { get; set; }

        public DateTime AppliedDate { get; set; }

        public string Status { get; set; } = "Applied";

        public bool IsDeleted { get; set; } = false;
    }
}