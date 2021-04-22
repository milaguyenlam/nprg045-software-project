using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class ShoppingList
    {
        public ShoppingList()
        {
            ShoppingListItems = new HashSet<ShoppingListItem>();
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public int State { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? CloseTime { get; set; }

        public virtual AspNetUser User { get; set; }
        public virtual ICollection<ShoppingListItem> ShoppingListItems { get; set; }
    }
}
