using MediatR;
using stable_matching_app.Application.Commands;
using stable_matching_app.Application.Interfaces;
using stable_matching_app.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace stable_matching_app.Application.CommandHandlers
{
    public class DeleteAllocationHandler : IRequestHandler<DeleteAllocation, Allocation>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteAllocationHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Allocation> Handle(DeleteAllocation request, CancellationToken cancellationToken)
        {
            var allocation = await _unitOfWork.AllocationRepository.GetAll();

            
            if (allocation == null)
            {
                return new Allocation();
            }

            
            for (int i = 0; i < allocation.Count(); i++)
            {
                await _unitOfWork.AllocationRepository.Delete(allocation.ElementAt(i).Id);
            }
            await _unitOfWork.Save();

            
            return new Allocation();
        }
    }
}
