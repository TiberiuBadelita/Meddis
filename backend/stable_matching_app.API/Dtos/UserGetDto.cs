namespace stable_matching_app.API.Dtos
{
    public class UserGetDto
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Role { get; set; }

        public string? Email { get; set; }

        public string? DoctorHospitalPreferences { get; set; }

        public string? HospitalSpecializationPreferences { get; set; }

        public string? DoctorSpecializationPreferences { get; set; }

        public float? ExamGrade { get; set; }
    }
}
