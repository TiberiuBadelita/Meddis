using AutoMapper;
using stable_matching_app.API.Dtos;
using stable_matching_app.Application.Commands;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.API.Profiles
{
    public class AllocationProfile : Profile
    {
        public AllocationProfile()
        {
            CreateMap<Allocation, AllocationGetDto>();
            CreateMap<AllocationPutPostDto, InsertAllocation>();
        }
    }
    
}
