namespace stable_matching_app.Domain.Models
{
    public class Allocation
    {
        public Guid Id { get; set; }

        public Guid? HospitalId { get; set; }

        public Guid? DoctorId { get; set; }

        public string Specialization { get; set; }
    }
}
