using System.Collections.Generic;
using Backend.Repositories;
using Backend.Models.Database;
using System.Linq;
using static Backend.Models.Client.Types;

namespace Backend.Services
{
    public interface IProductService : IGetEntityService<Product>
    {
        IEnumerable<Product> GetActiveProducts(int offset, int limit, FilterType filterType, IEnumerable<int> categoryIds, int? vendorId);
    }

    public class ProductService : GetEntityService<Product>, IProductService
    {
        public ProductService(IEntityRepository<Product> entityRepository) : base(entityRepository)
        { }
        public IEnumerable<Product> GetActiveProducts(int offset, int limit, FilterType filterType, IEnumerable<int> categoryIds, int? vendorId)
        {
            //TODO: refactor category filtering
            if (filterType == FilterType.CATEGORY && (categoryIds == null || !categoryIds.Any())
            || (filterType == FilterType.VENDOR && !vendorId.HasValue))
            {
                return null;
            }
            int firstCatId = categoryIds != null ? categoryIds.FirstOrDefault() : -1;
            IEnumerable<Product> filteredProducts = EntityRepository.GetMany(p =>
                p.ActiveOffers.Count() > 0
                && (filterType == FilterType.ALL
                    || (filterType == FilterType.CATEGORY && p.ProductCategories.Any(pc => pc.CategoryId == firstCatId))
                    || (filterType == FilterType.VENDOR && p.ActiveOffers.Any(ao => ao.Store.VendorId == vendorId))
                )
            )
            .ToList()
            .Where(p => filterType != FilterType.CATEGORY || categoryIds.All(catId => p.ProductCategories.Any(pc => pc.CategoryId == catId)))
            .Skip(offset)
            .Take(limit);

            return filteredProducts.AsEnumerable();
        }

    }
}