using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

#nullable disable

namespace Backend.Models.Database
{
    public partial class ContactDetail
    {
        public ContactDetail()
        {
            AspNetUsers = new HashSet<AspNetUser>();
            Stores = new HashSet<Store>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public Geometry Geolocation { get; set; }
        public string Ico { get; set; }
        public string Country { get; set; }

        public virtual ICollection<AspNetUser> AspNetUsers { get; set; }
        public virtual ICollection<Store> Stores { get; set; }
    }
}
