using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class AgencyRepAccountDetails
    {
        public string AccountName { get; set; }
        public int SubscriptionLevel { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateAssigned { get; set; }
        public DateTime DateClosed { get; set; }
    }
}
