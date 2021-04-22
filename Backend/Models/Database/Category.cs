using System;
using System.Collections.Generic;

#nullable disable

namespace Backend.Models.Database
{
    public partial class Category
    {
        public Category()
        {
            CategoryMappings = new HashSet<CategoryMapping>();
            CategoryParentCategories = new HashSet<CategoryParent>();
            CategoryParentParents = new HashSet<CategoryParent>();
            CategoryTrans = new HashSet<CategoryTran>();
            ProductCategories = new HashSet<ProductCategory>();
        }

        public int Id { get; set; }
        public string InternalName { get; set; }
        public string PicturePath { get; set; }

        public virtual ICollection<CategoryMapping> CategoryMappings { get; set; }
        public virtual ICollection<CategoryParent> CategoryParentCategories { get; set; }
        public virtual ICollection<CategoryParent> CategoryParentParents { get; set; }
        public virtual ICollection<CategoryTran> CategoryTrans { get; set; }
        public virtual ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
