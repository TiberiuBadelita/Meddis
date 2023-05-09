using stable_matching_app.Application.Interfaces;

namespace stable_matching_app.DataAccess
{
    public sealed class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext _databaseContext;

        public IAllocationRepository AllocationRepository { get; private set; }

        public UnitOfWork(DatabaseContext context,
                          IAllocationRepository allocationRepository)
        {
            _databaseContext = context;
            AllocationRepository = allocationRepository;
        }

        public async Task Save()
        {
            await _databaseContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            _databaseContext.Dispose();
        }
    }
}
