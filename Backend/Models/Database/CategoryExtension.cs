using System.Collections.Generic;
using System.Linq;

namespace Backend.Models.Database
{
    public partial class Category
    {
        public bool IsTopLevel()
        {
            //TODO: Add IsTopLevel flag to the database
            return this.CategoryParentParents.Any();
        }
        public bool IsForeign()
        {
            //TODO: Add IsForeign flag to the database
            return !this.CategoryParentCategories.Any() && !this.CategoryParentParents.Any();
        }
        public bool IsChild()
        {
            return !IsForeign() && !IsTopLevel();
        }

        public override bool Equals(object obj)
        {
            return obj is Category category &&
                   InternalName == category.InternalName;
        }

        public override int GetHashCode()
        {
            return InternalName.GetHashCode();
        }
    }
}