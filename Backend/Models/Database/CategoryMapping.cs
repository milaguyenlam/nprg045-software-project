using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class CategoryMapping
    {
        public int VendorId { get; set; }
        public string ForeignCategoryName { get; set; }
        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }
        public virtual Vendor Vendor { get; set; }
    }
}
