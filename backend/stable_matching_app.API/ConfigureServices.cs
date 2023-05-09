using MediatR;
using System.Reflection;

namespace stable_matching_app.Application
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            var assemblies = Assembly.GetAssembly(typeof(AssemblyMarker));
            if (assemblies == null)
            {
                throw new Exception("Assembly not found");
            }

            services.AddMediatR(assemblies);
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
         
            return services;
        }
    }
}
