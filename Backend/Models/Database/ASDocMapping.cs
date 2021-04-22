using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class AsDocMapping
    {
        public int EntityId { get; set; }
        public string EntityType { get; set; }
        public string DocId { get; set; }
    }
}
