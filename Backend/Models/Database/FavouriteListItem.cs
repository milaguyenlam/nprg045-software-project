using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class FavouriteListItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }

        public virtual Product Product { get; set; }
        public virtual AspNetUser User { get; set; }
    }
}
