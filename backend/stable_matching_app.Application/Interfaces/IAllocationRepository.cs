using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.Interfaces
{
    public interface IAllocationRepository
    {
        Task<Allocation> Get(Guid id);

        Task<List<Allocation>?> GetAll();

        Task<Allocation> Create(Allocation allocation);

        Task<Allocation> Update(Allocation allocation);

        Task<Allocation> Delete(Guid id);
    }
}
