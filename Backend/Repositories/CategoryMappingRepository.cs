using Backend.Models.Database;
using System.Collections.Generic;
using System.Linq;
using Backend.Common;


namespace Backend.Repositories
{
    public interface ICategoryMappingRepository
    {
        IEnumerable<Category> Map(IEnumerable<Category> foreignCats, Vendor vendor);
        void Add(Vendor vendor, string foreignCatName, Category category);
    }

    public class CategoryMappingRepository : EntityRepository<CategoryMapping>, ICategoryMappingRepository
    {

        public CategoryMappingRepository(SPriceContext dbContext) : base(dbContext)
        { }

        public IEnumerable<Category> Map(IEnumerable<Category> foreignCats, Vendor vendor)
        {
            var result = new HashSet<Category>();
            foreach (var foreignCat in foreignCats)
            {
                var canonizedCatName = foreignCat.InternalName.Canonize();
                var mappedCategoryIds = GetMany(mp => mp.ForeignCategoryName == canonizedCatName && mp.VendorId == vendor.Id)
                                            .Select(mp => mp.Category).AsEnumerable();
                result.UnionWith(mappedCategoryIds);
            }
            return result;
        }

        public void Add(Vendor vendor, string foreignCatName, Category category)
        {
            Add(
                new CategoryMapping
                {
                    Vendor = vendor,
                    ForeignCategoryName = foreignCatName.Canonize(),
                    Category = category
                }
            );
        }

    }

}