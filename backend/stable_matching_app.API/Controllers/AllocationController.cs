using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using stable_matching_app.API.Dtos;
using stable_matching_app.Application.Commands;
using stable_matching_app.Application.Queries;
using System.Numerics;
using System.Runtime.InteropServices;

namespace stable_matching_app.API.Controllers
{
    [ApiController]
    [Route("api/allocations")]
    public class AllocationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly string _filePath = @"deadline.txt";


        public AllocationController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllocations()
        {
            var allocations = await _mediator.Send(new GetAllAlocations());
            var mappedResult = _mapper.Map<List<AllocationGetDto>>(allocations);
            return Ok(mappedResult);
        }

        [HttpPost]
        public async Task<IActionResult> AddAllocation([FromBody] AllocationPutPostDto allocationPutPostDto)
        {
            var command = _mapper.Map<InsertAllocation>(allocationPutPostDto);
            var created = await _mediator.Send(command);
            var createdDto = _mapper.Map<AllocationGetDto>(created);

            return CreatedAtAction(nameof(AddAllocation), new { id = created.Id }, createdDto);
        }

        [HttpPost]
        [Route("generate")]
        public async Task<IActionResult> GenerateAllocations()
        {

            var query = new GetAllUsers();
            var users = await _mediator.Send(query);
            var usersGetDto = _mapper.Map<IEnumerable<UserGetDto>>(users);

            var doctors = usersGetDto.Where(u => u.Role == "Doctor").ToList();
            var hospitals = usersGetDto.Where(u => u.Role == "Hospital").ToList();

            var allocation = new Dictionary<string, string>();
            var specilizationSelected = new Dictionary<string, string>();

            var doctorPreferences = new Dictionary<string, List<string>>();

            var doctorSpecializationPreferences = new Dictionary<string, List<string>>();

            var hospitalSpecializationPreferences = new Dictionary<string, List<string>>();

            var hospitalSpecializationAvailablePlaces = new Dictionary<string, Dictionary<string, int>>();

            doctors = doctors.OrderByDescending(p => p.ExamGrade).ToList();

          
            foreach (var doctor in doctors)
            {
                var preferences = new List<string>();
                var specPreferences = new List<string>();

                if (doctor.DoctorHospitalPreferences != null)
                {
                    
                    foreach (var hospitalId in doctor.DoctorHospitalPreferences.Split(","))
                    {
                        var hospital = hospitals.FirstOrDefault(h => h.Id == hospitalId);
                        if (hospital != null)
                        {
                            preferences.Add(hospital.Id);
                        }
                    }



                    doctorPreferences.Add(doctor.Id, preferences);



                  
                    foreach (var specialization in doctor.DoctorSpecializationPreferences.Split(','))
                    {
                        specPreferences.Add(specialization);
                    }


                    doctorSpecializationPreferences.Add(doctor.Id, specPreferences);
                }
            }

            
            foreach (var hospital in hospitals)
            {
                var preferences = new List<string>();
                var availablePlaces = new Dictionary<string, int>();

                
                if (hospital.HospitalSpecializationPreferences != null)
                {
                    foreach (var specialization in hospital.HospitalSpecializationPreferences.Split(','))
                    {


                        var spec = specialization.Split('-')[0];
                        var placesLeft = int.Parse(specialization.Split('-')[1]);

                        preferences.Add(spec);
                        availablePlaces.Add(spec, placesLeft);
                    }


                    hospitalSpecializationPreferences.Add(hospital.Id, preferences);
                    hospitalSpecializationAvailablePlaces.Add(hospital.Id, availablePlaces);
                }
            }
            
            var proposals = new Dictionary<string, int>();

           
            foreach (var doctor in doctors)
            {
                proposals[doctor.Id] = 0;
            }

           
            while (allocation.Count < doctors.Count)
            {
               
                foreach (var doctor in doctors)
                {
                    
                    if (!allocation.ContainsKey(doctor.Id))
                    {
                        var preferences = doctorPreferences[doctor.Id];

                        var specializations = doctorSpecializationPreferences[doctor.Id];

                        
                        for (int i = proposals[doctor.Id]; i < preferences.Count; i++)
                        {
                            var hospitalId = preferences[i];
                            var availablePlaces = hospitalSpecializationAvailablePlaces[hospitalId];
                            
                            var hospital = hospitals.FirstOrDefault(h => h.Id == hospitalId);
                            bool alocated = false;
                            foreach (var specialization in specializations) {
                                if (hospital != null && availablePlaces.ContainsKey(specialization))
                                {
                                   
                                    allocation.Add(doctor.Id, hospital.Id);
                                    specilizationSelected.Add(doctor.Id, specialization);

                                    availablePlaces[specialization]--;
                                    proposals[doctor.Id] = i + 1;
                                    alocated = true;
                                    break;
                                }
                            }

                            if (alocated)
                            {
                                break;
                            }
                        }
                    }
                }
            }

            
            var delete_command = new DeleteAllocation();
            await _mediator.Send(delete_command);

            
            AllocationPutPostDto allocationPutPostDto = new AllocationPutPostDto();

            foreach (var alloc in allocation)
            {
                allocationPutPostDto.DoctorId = Guid.Parse(alloc.Key);
                allocationPutPostDto.HospitalId = Guid.Parse(alloc.Value);
                allocationPutPostDto.Specialization = specilizationSelected[alloc.Key];

                var command = _mapper.Map<InsertAllocation>(allocationPutPostDto);
                var created = await _mediator.Send(command);
                var createdDto = _mapper.Map<AllocationGetDto>(created);

            }

            return Ok(allocation);

        }

        [HttpGet]
        [Route("get-deadline")]
        public async Task<IActionResult> GetDeadline()
        {
            try
            {
                using (StreamReader sr = new StreamReader("deadline.txt"))

                {

                    string line = sr.ReadToEnd();

                    return Ok(line);

                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost]
        [Route("set-deadline/{deadlineDate}")]
        public async Task<IActionResult> SetDeadline([FromRoute] string deadlineDate)
        {
            try
            {
                using (StreamWriter writer = new StreamWriter(_filePath))
                {
                    await writer.WriteLineAsync(deadlineDate.ToString());
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error saving deadline: {ex.Message}");
            }
          
        }

    }
}
