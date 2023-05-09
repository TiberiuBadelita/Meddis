using MediatR;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.Queries
{
    public class GetUserById : IRequest<User>
    {
        public string? Id { get; set; }
    }
}
