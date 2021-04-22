using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class ActiveOffer
    {
        public ActiveOffer()
        {
            ShoppingListItems = new HashSet<ShoppingListItem>();
        }

        public int Id { get; set; }
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public DateTime FromDate { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountRate { get; set; }
        public int? InStockCount { get; set; }
        public DateTime ToDate { get; set; }
        public bool? IsTaxed { get; set; }
        public string Source { get; set; }
        public string Description { get; set; }

        public virtual Product Product { get; set; }
        public virtual Store Store { get; set; }
        public virtual ICollection<ShoppingListItem> ShoppingListItems { get; set; }
    }
}
