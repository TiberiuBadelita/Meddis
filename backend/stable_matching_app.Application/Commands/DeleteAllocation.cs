using MediatR;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.Commands
{
    public class DeleteAllocation : IRequest<Allocation>
    {
    }
}
