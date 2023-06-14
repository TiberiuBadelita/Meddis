using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using stable_matching_app.API.Service;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.API.Controllers
{

    [ApiController]
    [Route("api/seed")]
    public class SeedDBController : ControllerBase
    {
        private readonly SeedDBService _seedDBService;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SeedDBController(SeedDBService seedDBService, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _seedDBService = seedDBService;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> SeedDB()
        {
            await _seedDBService.Seed(_userManager, _roleManager);
            return Ok();
        }

    }
}
