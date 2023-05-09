using MediatR;
using Microsoft.AspNetCore.Identity;
using stable_matching_app.Application.Commands;
using stable_matching_app.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace stable_matching_app.Application.CommandHandlers
{
    public class InsertUserHandler : IRequestHandler<InsertUser , User>
    {

        private readonly UserManager<User> _userManager;

        public InsertUserHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User> Handle(InsertUser request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                UserName = request.Email,
                Role = request.Role,
                PhoneNumber = request.PhoneNumber,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            if (request.Password != null && request.Role != null)
            {
                var result = await _userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, request.Role);
                    return user;
                }
            }

            return new User();
        }
    }
}
