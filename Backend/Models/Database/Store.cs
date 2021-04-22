using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class Store
    {
        public Store()
        {
            ActiveOffers = new HashSet<ActiveOffer>();
        }

        public int Id { get; set; }
        public int VendorId { get; set; }
        public int ContactDetailsId { get; set; }
        public string OpeningHours { get; set; }

        public virtual ContactDetail ContactDetails { get; set; }
        public virtual Vendor Vendor { get; set; }
        public virtual ICollection<ActiveOffer> ActiveOffers { get; set; }
    }
}
