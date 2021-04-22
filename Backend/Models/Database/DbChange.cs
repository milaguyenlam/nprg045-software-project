using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class DbChange
    {
        public int SeqNum { get; set; }
        public int EntityId { get; set; }
        public string Operation { get; set; }
        public string EntityType { get; set; }
    }
}
