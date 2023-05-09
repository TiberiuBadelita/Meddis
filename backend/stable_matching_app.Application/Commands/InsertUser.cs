using MediatR;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application.Commands
{
    public class InsertUser : IRequest<User>
    {
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Role { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
    }
}
