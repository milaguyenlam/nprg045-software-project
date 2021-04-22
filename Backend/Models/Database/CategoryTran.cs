using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class CategoryTran
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public int LanguageId { get; set; }

        public virtual Category Category { get; set; }
        public virtual Language Language { get; set; }
    }
}
