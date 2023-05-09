using Microsoft.AspNetCore.Identity;

namespace stable_matching_app.Domain.Models
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Role { get; set; }

        public string? DoctorHospitalPreferences { get; set; }

        public string? HospitalSpecializationPreferences { get; set; }

        public string? DoctorSpecializationPreferences { get; set; }

        public float? ExamGrade { get; set; }
    }
}
