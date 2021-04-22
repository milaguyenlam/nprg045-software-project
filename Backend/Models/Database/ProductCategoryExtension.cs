using System;

namespace Backend.Models.Database
{
    public partial class ProductCategory
    {
        //FIXME: inherit from IEquatable<T>
        public override bool Equals(object obj)
        {
            return obj is ProductCategory productCategory &&
                productCategory.Product.Equals(Product) &&
                productCategory.Category.Equals(Category);
        }

        public override int GetHashCode()
        {
            return Category != null && Product != null ? HashCode.Combine(Category.GetHashCode(), Product.GetHashCode()) : base.GetHashCode();
        }
    }
}

