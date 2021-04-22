using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class CategoryParent
    {
        public int CategoryId { get; set; }
        public int ParentId { get; set; }

        public virtual Category Category { get; set; }
        public virtual Category Parent { get; set; }
    }
}
