using System.ComponentModel.DataAnnotations;

namespace stable_matching_app.API.Dtos
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
