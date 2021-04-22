using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class Producer
    {
        public Producer()
        {
            Products = new HashSet<Product>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string ThumbnailPath { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
