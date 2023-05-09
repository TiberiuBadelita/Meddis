﻿namespace stable_matching_app.API.Dtos
{
    public class AllocationGetDto
    {
        public Guid Id { get; set; }

        public Guid? HospitalId { get; set; }

        public Guid? DoctorId { get; set; }

        public string Specialization { get; set; }
    }
}
