using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class Language
    {
        public Language()
        {
            CategoryTrans = new HashSet<CategoryTran>();
        }

        public int Id { get; set; }
        public string Code { get; set; }

        public virtual ICollection<CategoryTran> CategoryTrans { get; set; }
    }
}
