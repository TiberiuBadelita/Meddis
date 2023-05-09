using MediatR;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.Commands
{
    public class InsertAllocation : IRequest<Allocation>
    {
        public Guid Id { get; set; }

        public Guid? HospitalId { get; set; }

        public Guid? DoctorId { get; set; }

        public string? Specialization { get; set; }
    }
}
