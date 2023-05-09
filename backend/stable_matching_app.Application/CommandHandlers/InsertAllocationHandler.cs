using MediatR;
using stable_matching_app.Application.Commands;
using stable_matching_app.Application.Interfaces;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.CommandHandlers
{
    public class InsertAllocationHandler : IRequestHandler<InsertAllocation, Allocation>
    {
        private readonly IUnitOfWork _unitOfWork;

        public InsertAllocationHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Allocation> Handle(InsertAllocation request, CancellationToken cancellationToken)
        {
            var allocation = new Allocation
            {
                Id = Guid.NewGuid(),
                HospitalId = request.HospitalId,
                DoctorId = request.DoctorId,
                Specialization = request.Specialization,
            };
        

            await _unitOfWork.AllocationRepository.Create(allocation);
            await _unitOfWork.Save();

            return allocation;
        }
    }
}
