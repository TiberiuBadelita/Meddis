namespace stable_matching_app.Application.Interfaces
{
     public interface IUnitOfWork : IDisposable
    {

        public IAllocationRepository AllocationRepository { get; }

        Task Save();
    }
}
