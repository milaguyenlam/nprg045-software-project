using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class Vendor
    {
        public Vendor()
        {
            CategoryMappings = new HashSet<CategoryMapping>();
            Stores = new HashSet<Store>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string ThumbnailPath { get; set; }

        public virtual ICollection<CategoryMapping> CategoryMappings { get; set; }
        public virtual ICollection<Store> Stores { get; set; }
    }
}
