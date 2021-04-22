using Backend.Repositories;
using Backend.Models.Database;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{

    public interface ICategoryService : IGetEntityService<Category>
    {
        IEnumerable<Category> GetAllTopLevel();
        IEnumerable<Category> GetSubCategories(int categoryId);
        IEnumerable<Category> GetCategories(int productId);
    }

    public class CategoryService : GetEntityService<Category>, ICategoryService
    {
        public CategoryService(IEntityRepository<Category> categoryRepository) : base(categoryRepository)
        {
        }
        public IEnumerable<Category> GetAllTopLevel()
        {
            var topCategories = EntityRepository.GetMany(cg => cg.CategoryParentParents.Count > 0);
            return topCategories;
        }

        public IEnumerable<Category> GetCategories(int productId)
        {
            return EntityRepository.GetMany(cat => cat.ProductCategories.Any(prodCat => prodCat.ProductId == productId));
        }

        public IEnumerable<Category> GetSubCategories(int categoryId)
        {
            var category = GetById(categoryId);
            var subCategories = category.CategoryParentParents.Select(cpp => cpp.Category);
            return subCategories;
        }

    }
}