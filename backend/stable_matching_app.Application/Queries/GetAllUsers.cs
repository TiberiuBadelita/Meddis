using MediatR;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.Queries
{
    public class GetAllUsers : IRequest<List<User>>
    {
    }
}
