using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using stable_matching_app.API.Dtos;
using stable_matching_app.Application.Commands;
using stable_matching_app.Application.Queries;

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

            var doctorSpecializations = new Dictionary<string, string>();

            var hospitalSpecializationPreferences = new Dictionary<string, List<string>>();

            var hospitalSpecializationAvailablePlaces = new Dictionary<string, Dictionary<string, int>>();

            doctors = doctors.OrderByDescending(p => p.ExamGrade).ToList();


            foreach (var doctor in doctors)
            {
                var preferences = new List<string>();
                string specialization;

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

                    specialization = doctor.DoctorSpecializationPreferences;

                    doctorSpecializations.Add(doctor.Id, specialization);
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


            while (allocation.Count < doctors.Count)
            {
                foreach (var doctor in doctors)
                {
                    if (!allocation.ContainsKey(doctor.Id))
                    {
                        var preferences = doctorPreferences[doctor.Id];
                        var specialization = doctorSpecializations[doctor.Id];

                        for (int i = 0; i < preferences.Count; i++)
                        {
                            var hospitalId = preferences[i];
                            var availablePlaces = hospitalSpecializationAvailablePlaces[hospitalId];
                            var hospital = hospitals.FirstOrDefault(h => h.Id == hospitalId);

                            if (hospital != null && availablePlaces.ContainsKey(specialization))
                            {
                                if (availablePlaces[specialization] == 0)
                                {

                                    var currentAssignedDoctor = allocation.Where(a => a.Value == hospitalId && specialization == doctorSpecializations[a.Key]).OrderByDescending(a => doctorPreferences[a.Key].IndexOf(a.Value)).FirstOrDefault();


                                    if (currentAssignedDoctor.Key != null)
                                    {

                                        var currentDoctorPreferenceIndex = i;
                                        var currentAssignedDoctorPreferenceIndex = doctorPreferences[currentAssignedDoctor.Key].IndexOf(hospitalId);


                                        if (currentDoctorPreferenceIndex < currentAssignedDoctorPreferenceIndex)
                                        {
                                            allocation.Remove(currentAssignedDoctor.Key);
                                            specilizationSelected.Remove(currentAssignedDoctor.Key);
                                            availablePlaces[specialization]++;

                                            allocation.Add(doctor.Id, hospital.Id);
                                            specilizationSelected.Add(doctor.Id, specialization);
                                            availablePlaces[specialization]--;
                                            break;
                                        }
                                    }
                                }
                                else
                                {

                                    allocation.Add(doctor.Id, hospital.Id);
                                    specilizationSelected.Add(doctor.Id, specialization);
                                    availablePlaces[specialization]--;
                                    break;


                                }
                                
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

        [HttpPost]
        [Route("generate-with-indifference")]
        public async Task<IActionResult> GenerateAllocationsWithIndifference()
        {

            var query = new GetAllUsers();
            var users = await _mediator.Send(query);
            var usersGetDto = _mapper.Map<IEnumerable<UserGetDto>>(users);

            var doctors = usersGetDto.Where(u => u.Role == "Doctor").ToList();
            var hospitals = usersGetDto.Where(u => u.Role == "Hospital").ToList();

            var allocation = new Dictionary<string, string>();
            var specilizationSelected = new Dictionary<string, string>();

            var doctorPreferences = new Dictionary<string, List<string>>();

            var doctorSpecializations = new Dictionary<string, string>();

            var hospitalSpecializationPreferences = new Dictionary<string, List<string>>();

            var hospitalSpecializationAvailablePlaces = new Dictionary<string, Dictionary<string, int>>();

            doctors = doctors.OrderByDescending(p => p.ExamGrade).ToList();


            foreach (var doctor in doctors)
            {
                var preferences = new List<string>();
                string specialization;

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

                    specialization = doctor.DoctorSpecializationPreferences;

                    doctorSpecializations.Add(doctor.Id, specialization);
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
                        if (proposals[doctor.Id] == -1)
                        {
                            var sameDoctorsSpecialization = doctors.Where(d => d.DoctorSpecializationPreferences == doctor.DoctorSpecializationPreferences && doctor.Id != d.Id).ToList();

                            var sameDoctorsSpecializationFiltered = sameDoctorsSpecialization.Where(d => proposals[d.Id] > 2).ToList();

                            sameDoctorsSpecializationFiltered = sameDoctorsSpecializationFiltered.Where(d => doctorPreferences[d.Id][proposals[d.Id] - 1] == doctorPreferences[doctor.Id][0] || doctorPreferences[d.Id][proposals[d.Id] - 1] == doctorPreferences[doctor.Id][1]).ToList();

                            var random = new Random();

                            if (sameDoctorsSpecializationFiltered.Count != 0)
                            {
                                var randomDoctor = sameDoctorsSpecializationFiltered[random.Next(0, sameDoctorsSpecializationFiltered.Count)];


                                var hospitalId = doctorPreferences[randomDoctor.Id][proposals[randomDoctor.Id] - 1];

                                var hospital = hospitals.FirstOrDefault(h => h.Id == hospitalId);

                                if (hospital != null)
                                {
                                    allocation.Add(doctor.Id, hospital.Id);
                                    specilizationSelected.Add(doctor.Id, doctorSpecializations[doctor.Id]);

                                    var availablePlaces = hospitalSpecializationAvailablePlaces[hospitalId];

                                    proposals[doctor.Id] = doctorPreferences[doctor.Id].IndexOf(hospitalId) + 1;
                                }


                                allocation.Remove(randomDoctor.Id);
                                specilizationSelected.Remove(randomDoctor.Id);
                                proposals[randomDoctor.Id] = 0;

                            }
                        }
                        else
                        {

                            var preferences = doctorPreferences[doctor.Id];

                            var specialization = doctorSpecializations[doctor.Id];


                            for (int i = proposals[doctor.Id]; i < preferences.Count; i++)
                            {
                                var hospitalId = preferences[i];
                                var availablePlaces = hospitalSpecializationAvailablePlaces[hospitalId];

                                var hospital = hospitals.FirstOrDefault(h => h.Id == hospitalId);


                                if (hospital != null && availablePlaces.ContainsKey(specialization))
                                    if (availablePlaces[specialization] > 0)
                                    {

                                        allocation.Add(doctor.Id, hospital.Id);
                                        specilizationSelected.Add(doctor.Id, specialization);

                                        availablePlaces[specialization]--;

                                        proposals[doctor.Id] = i + 1;
                                        break;

                                    }

                            }

                            if (proposals[doctor.Id] == 0)
                            {
                                proposals[doctor.Id] = -1;
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
