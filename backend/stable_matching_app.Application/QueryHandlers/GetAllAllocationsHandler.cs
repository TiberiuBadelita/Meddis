using stable_matching_app.Application.Interfaces;
using stable_matching_app.Application.Queries;
using stable_matching_app.Domain.Models;
using MediatR;

namespace stable_matching_app.Application.QueryHandlers
{
    public class GetAllAllocationsHandler : IRequestHandler<GetAllAlocations, List<Allocation>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllAllocationsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<Allocation>> Handle(GetAllAlocations request, CancellationToken cancellationToken)
        {
            var appointments = await _unitOfWork.AllocationRepository.GetAll();
            appointments ??= new List<Allocation>();
            return appointments;
        }
    }
}
