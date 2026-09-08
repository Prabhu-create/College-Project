namespace CollegeManagement.API.Models
{
    public class StudentLoginRequest
    {
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }
}