using stable_matching_app.Domain.Models;
using MediatR;

namespace stable_matching_app.Application.Queries
{
    public class GetAllAlocations : IRequest<List<Allocation>>
    {
    }
}
