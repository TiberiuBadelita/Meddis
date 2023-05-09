using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using stable_matching_app.Application.Queries;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.QueryHandlers
{
    public class GetAllUsersHandler : IRequestHandler<GetAllUsers , List<User>>
    {
        private readonly UserManager<User> _userManager;

        public GetAllUsersHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<User>> Handle(GetAllUsers request, CancellationToken cancellationToken)
        {
            if (_userManager is null) return new List<User>();

            var users = await _userManager.Users.Take(1000).ToListAsync(cancellationToken: cancellationToken);
            return users;
        }
    }
}
