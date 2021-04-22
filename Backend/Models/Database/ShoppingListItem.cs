using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class ShoppingListItem
    {
        public int Id { get; set; }
        public int ShoppingListId { get; set; }
        public int ActiveOfferId { get; set; }
        public int Quantity { get; set; }
        public int State { get; set; }

        public virtual ActiveOffer ActiveOffer { get; set; }
        public virtual ShoppingList ShoppingList { get; set; }
    }
}
