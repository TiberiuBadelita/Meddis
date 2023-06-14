using Microsoft.AspNetCore.Identity;
using stable_matching_app.Application;
using stable_matching_app.Application.Interfaces;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.API.Service
{
    public class SeedDBService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SeedDBService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Seed(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            var generator = new Generator(_unitOfWork, userManager, roleManager);

            await generator.Generate();
        }
    }
}
