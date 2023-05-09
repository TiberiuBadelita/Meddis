using MediatR;
using stable_matching_app.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace stable_matching_app.Application.Commands
{
    public class DeleteAllocation : IRequest<Allocation>
    {
    }
}
