using Faker;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using stable_matching_app.Application.Interfaces;
using stable_matching_app.Domain.Models;

namespace stable_matching_app.Application
{
    public class Generator
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public Generator(IUnitOfWork unitOfWork, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        
        public async Task Generate()
        {
            var roleExists = await _roleManager.RoleExistsAsync("Hospital");

            if (!roleExists)
            {
                var role = new IdentityRole
                {
                    Name = "Hospital"
                };
                await _roleManager.CreateAsync(role);
            }

             roleExists = await _roleManager.RoleExistsAsync("Doctor");

            if (!roleExists)
            {
                var role = new IdentityRole
                {
                    Name = "Doctor"
                };
                await _roleManager.CreateAsync(role);
            }


            await GenerateHospitals(2);
            await GenerateDoctors(5);

            await _unitOfWork.Save();
           
        }

        public async Task GenerateHospitals(int howMany)
        {
            string[] specialties = {
            "Anesthesiology", "Cardiology", "Dermatology",
            "Emergency medicine", "Endocrinology", "Gastroenterology", "General surgery",
            "Hematology", "Infectious disease", "Internal medicine", "Neurology",
            "Obstetrics and gynecology", "Oncology", "Ophthalmology", "Orthopedics",
            "Otolaryngology", "Pediatrics", "Physical medicine and rehabilitation",
            "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Urology"
             };

            for (int i = 0; i < howMany; i++)
            {
                List<string> specialtiesList = new List<string>(specialties);

                var hospital = new User
                {
                    FirstName = "",
                    LastName = "Hospital " + Faker.Name.FullName(),
                    Email = Faker.Internet.Email(),
                    Role = "Hospital",
                    SecurityStamp = Guid.NewGuid().ToString(),
                };

                hospital.UserName = hospital.Email;

                Random random = new Random();
                int numberOfPreferences = random.Next(1, 11);
                
                for (int j=0; j < numberOfPreferences - 1; j++)
                {
                    int placesLeft = random.Next(1, 6);
                    string specialization = specialtiesList.ElementAt(random.Next(1, specialtiesList.Count));

                    specialtiesList.Remove(specialization);

                    hospital.HospitalSpecializationPreferences = $"{hospital.HospitalSpecializationPreferences}{specialization}-{placesLeft},";
                }

                int lastPlacesLeft = random.Next(1, 6);
                string lastSpecialization = specialtiesList.ElementAt(random.Next(1, specialtiesList.Count));

                hospital.HospitalSpecializationPreferences = $"{hospital.HospitalSpecializationPreferences}{lastSpecialization}-{lastPlacesLeft}";


                var result = await _userManager.CreateAsync(hospital, "Password123!");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(hospital, hospital.Role); 
                }
               
            }

            await _unitOfWork.Save();

        }


        public async Task GenerateDoctors(int howMany)
        {
            var hospitals = await _userManager.GetUsersInRoleAsync("Hospital");

            for (int i = 0; i < howMany; i++) {

                var doctor = new User
                {
                    FirstName = Faker.Name.First(),
                    LastName = Faker.Name.Last(),
                    Email = Faker.Internet.Email(),
                    Role = "Doctor",
                    SecurityStamp = Guid.NewGuid().ToString(),
                };

                doctor.UserName = doctor.Email;

                Random random = new Random();

                doctor.ExamGrade = random.Next(600,1000);

                int numberOfPreferences = random.Next(1, 11);

                for (int j = 0; j < numberOfPreferences - 1; j++)
                {
                    int hospitalId = random.Next(0, hospitals.Count);
                    var hospital = hospitals.ElementAt(hospitalId);

                    doctor.DoctorHospitalPreferences = $"{doctor.DoctorHospitalPreferences}{hospital.Id},";
                }

                int lastHospitalId = random.Next(0, hospitals.Count);
                var lastHospital = hospitals.ElementAt(lastHospitalId);

                doctor.DoctorHospitalPreferences = $"{doctor.DoctorHospitalPreferences}{lastHospital.Id}";

                var k = 0;
                
                while (k < 3)
                {

                    var randomHospitalId = doctor.DoctorHospitalPreferences.Split(',').ElementAt(random.Next(0, doctor.DoctorHospitalPreferences.Split(',').ToList().Count));

                    var randomHospital = hospitals.FirstOrDefault(h => h.Id == randomHospitalId);

                    var specializationList = randomHospital.HospitalSpecializationPreferences.Split(",").ToList();

                    var randomSpecialization = specializationList.ElementAt(random.Next(0, specializationList.Count));

                    randomSpecialization = randomSpecialization.Split("-").ElementAt(0);

                    doctor.DoctorSpecializationPreferences = randomSpecialization;

                    k = specializationList.Count;

                }

                var result = await _userManager.CreateAsync(doctor, "Password123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(doctor, doctor.Role);
                }


            }

            await _unitOfWork.Save();
        }
    }
}
