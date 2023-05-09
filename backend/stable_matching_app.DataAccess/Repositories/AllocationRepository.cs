using Microsoft.EntityFrameworkCore;
using stable_matching_app.Application.Interfaces;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.DataAccess.Repositories
{
    public class AllocationRepository : IAllocationRepository
    {
        private readonly DatabaseContext _databaseContext;

        public AllocationRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<Allocation> Get(Guid id)
        {
            return await _databaseContext.Allocations.SingleOrDefaultAsync(a => a.Id == id);
        }
        
        public async Task<List<Allocation>> GetAll()
        {
            return await _databaseContext.Allocations.Take(100).ToListAsync();
        }

        public async Task<Allocation> Create(Allocation allocation)
        {
            await _databaseContext.Allocations.AddAsync(allocation);
            await _databaseContext.SaveChangesAsync();
            return allocation;
        }

        public async Task<Allocation> Delete(Guid id)
        {
            var allocation = await _databaseContext.Allocations.FindAsync(id);
            if (allocation == null)
            {
                return null;
            }

            _databaseContext.Allocations.Remove(allocation);
            await _databaseContext.SaveChangesAsync();

            return allocation;
        }

      
        public async Task<Allocation> Update(Allocation allocation)
        {
            _databaseContext.Entry(allocation).State = EntityState.Modified;
            await _databaseContext.SaveChangesAsync();
            return allocation;
        }
    }
}
