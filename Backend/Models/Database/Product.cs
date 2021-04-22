using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class Product
    {
        public Product()
        {
            ActiveOffers = new HashSet<ActiveOffer>();
            FavouriteListItems = new HashSet<FavouriteListItem>();
            ProductCategories = new HashSet<ProductCategory>();
        }

        public int Id { get; set; }
        public int? ProducerId { get; set; }
        public string Name { get; set; }
        public string Ean { get; set; }
        public string Description { get; set; }
        public string PicturePath { get; set; }

        public virtual Producer Producer { get; set; }
        public virtual ICollection<ActiveOffer> ActiveOffers { get; set; }
        public virtual ICollection<FavouriteListItem> FavouriteListItems { get; set; }
        public virtual ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
