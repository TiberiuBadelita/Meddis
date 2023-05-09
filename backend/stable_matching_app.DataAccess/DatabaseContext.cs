using stable_matching_app.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace stable_matching_app.DataAccess
{
    public class DatabaseContext : IdentityDbContext<User>
    {

        public DbSet<Allocation> Appointments => Set<Allocation>();
        public DbSet<Allocation> Allocations => Set<Allocation>();

        public DatabaseContext() { }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(@"Server=localhost\SQLEXPRESS;Database=MeddisApp;Trusted_Connection=True;Trust Server Certificate = true")
                    .LogTo(Console.Error.WriteLine, LogLevel.Information)//Console.Error.WriteLine  //LogLevel.Error
                    .EnableSensitiveDataLogging();//true
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

        }
    }
}
