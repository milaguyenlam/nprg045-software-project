using Backend.Models.Database;
using Microsoft.Extensions.Configuration;
using Backend.Common;
using System.Threading.Tasks;
using Backend.Repositories;
using System.Linq;
using Backend.Models.AppSearch;
using System.Collections.Generic;
using System;
using Microsoft.Extensions.Logging;

namespace Backend.Services
{

    public class ProductIdentificationResult
    {
        public enum State
        {
            Similar,
            Identical,
            Unidentifiable
        }

        public State state;
        public Product product;
        public bool updatedProductCategorization;

        public ProductIdentificationResult(State state, Product product, bool updatedProductCategorization)
        {
            this.state = state;
            this.product = product;
            this.updatedProductCategorization = updatedProductCategorization;
        }
    }

    public interface IProductIdentityService
    {
        Task<ProductIdentificationResult> IdentifyAndCategorize(Product product, Vendor vendor);
    }

    public class ProductIdentityService : IProductIdentityService
    {
        private readonly IRepositoryContext repositoryContext;
        private readonly ILogger logger;
        private readonly double similarityThreshold;
        private readonly double identityThreshold;
        public ProductIdentityService(IRepositoryContext repositoryContext, IConfiguration configuration, ILogger<ProductIdentityService> logger)
        {
            this.repositoryContext = repositoryContext;
            similarityThreshold = configuration.GetASSimilarityThreshold();
            identityThreshold = configuration.GetASIdentityThreshold();
            this.logger = logger;
        }

        public async Task<ProductIdentificationResult> IdentifyAndCategorize(Product inputProduct, Vendor vendor)
        {
            Product identicalProduct;
            IEnumerable<Product> similarProducts;
            if ((identicalProduct = IdentifyDummy(inputProduct)) != null
            || ((identicalProduct, similarProducts) = await IdentifyAppSearch(inputProduct)).identicalProduct != null)
            {
                return CreateIdenticalProductResult(inputProduct, identicalProduct, vendor);
            }
            else
            {
                return CreateSimilarProductResult(inputProduct, similarProducts, vendor);
            }
        }

        private async Task<(Product, IEnumerable<Product>)> IdentifyAppSearch(Product inputProduct)
        {
            var query = new IdentityRequestContent(inputProduct.Name);
            return await repositoryContext.AppSearch.SearchFor(query, searchResult =>
               {
                   var similarProducts = new List<Product>();
                   foreach (var doc in searchResult.results)
                   {
                       Product product;
                       if (repositoryContext.ASDocMappings.TryMapTo<Product>(doc.id.raw, repositoryContext.Products, SearchEntityType.PRODUCT, out product))
                       {
                           if (doc._meta.score >= identityThreshold)
                           {
                               return (product, similarProducts);
                           }
                           else if (doc._meta.score >= similarityThreshold)
                           {
                               similarProducts.Add(product);
                           }
                           else
                           {
                               break;
                           }
                       }
                       else
                       {
                           logger.LogError($"Identification AS query result contained non-product entity {doc.text.raw} with type {doc.type.raw}");
                       }
                   }
                   return (null, similarProducts);
               }
            );
        }
        private Product IdentifyDummy(Product inputProduct)
        {
            return repositoryContext.Products.Get(prod => (inputProduct.Ean != null && inputProduct.Ean.Equals(prod.Ean)) || inputProduct.Name.Equals(prod.Name));
        }

        private ProductIdentificationResult CreateIdenticalProductResult(Product inputProduct, Product identicalProduct, Vendor source)
        {
            ReplaceWithExistingCategoriesAndRemoveDuplicates(inputProduct);
            var allCategories = GetCategories(inputProduct).Concat(GetMappedCategories(GetCategories(inputProduct), source));
            var updatedCategorization = AddNewCategoriesToProduct(identicalProduct, allCategories);
            return new ProductIdentificationResult(ProductIdentificationResult.State.Identical, identicalProduct, updatedCategorization);
        }

        private ProductIdentificationResult CreateSimilarProductResult(Product inputProduct, IEnumerable<Product> similarProducts, Vendor source)
        {
            ReplaceWithExistingCategoriesAndRemoveDuplicates(inputProduct);
            AddNewCategoriesToProduct(inputProduct, GetMappedCategories(GetCategories(inputProduct), source));
            if (TryCategorizeProduct(inputProduct, similarProducts))
            {
                return new ProductIdentificationResult(ProductIdentificationResult.State.Similar, inputProduct, true);
            }
            else
            {
                return new ProductIdentificationResult(ProductIdentificationResult.State.Unidentifiable, inputProduct, true);
            }
        }

        private bool TryCategorizeProduct(Product inputProduct, IEnumerable<Product> similarProducts)
        {
            var childSPriceCategories = GetCategories(inputProduct).Where(cat => cat.IsChild());
            var parentSPriceCategories = GetCategories(inputProduct).Where(cat => cat.IsTopLevel());
            IEnumerable<Category> definiteParents;
            IEnumerable<Category> guessedParents;
            IEnumerable<Category> guessedChildren;

            if (childSPriceCategories.Any() && IsAnyParentPresent(childSPriceCategories, parentSPriceCategories))
            {
                return true;
            }
            if (childSPriceCategories.Any() && (definiteParents = GetDefiniteParents(childSPriceCategories)).Any())
            {
                AddNewCategoriesToProduct(inputProduct, definiteParents);
                return true;
            }
            if (childSPriceCategories.Any() && (guessedParents = TryGuessParents(childSPriceCategories, similarProducts)).Any())
            {
                logger.LogWarning($"Product {inputProduct.Name} has children categories specified [{ToString(childSPriceCategories)}], guessed parents from similar products [{ToString(guessedParents)}]");
                AddNewCategoriesToProduct(inputProduct, guessedParents);
                return true;
            }
            if (parentSPriceCategories.Any() && (guessedChildren = TryGuessChildren(parentSPriceCategories, similarProducts)).Any())
            {
                logger.LogWarning($"Product {inputProduct.Name} has parent categories specified [{ToString(parentSPriceCategories)}], guessed children from similar products [{ToString(guessedChildren)}]");
                AddNewCategoriesToProduct(inputProduct, guessedChildren);
                return true;
            }
            if (similarProducts.Any())
            {
                var inheritedCategorization = InheritCategorization(similarProducts);
                logger.LogWarning($"Product {inputProduct.Name} has no categories specified, inherited entire categorization from similar products [{ToString(inheritedCategorization)}]");
                AddNewCategoriesToProduct(inputProduct, inheritedCategorization);
                return true;
            }
            if (childSPriceCategories.Any())
            {
                var allParents = GetParents(childSPriceCategories);
                logger.LogWarning($"Product {inputProduct.Name} has children categories specified [{ToString(childSPriceCategories)}], couldn't guess parents from similar products, took all existing parents [{ToString(allParents)}]");
                //We can assume that in out categorization system, 
                //children have no more than 2 parents and that choosing both of them isn't so off
                AddNewCategoriesToProduct(inputProduct, allParents);
                return true;
            }

            logger.LogError($"Product {inputProduct.Name} has no categories specified and no similar products were found!");
            return false;
        }



        private IEnumerable<Category> InheritCategorization(IEnumerable<Product> similarProducts)
        {
            var spriceCategories = GetCategories(similarProducts).Where(cat => !cat.IsForeign());
            var mostFrequentChildren = spriceCategories.Where(cat => cat.IsChild()).GroupBy(cat => cat.InternalName).OrderByDescending(group => group.Count());
            var topLevels = spriceCategories.Where(cat => cat.IsTopLevel()).ToHashSet();

            foreach (var group in mostFrequentChildren)
            {
                var child = group.First();
                var occuringParents = child.CategoryParentCategories.Select(catParCat => catParCat.Parent).Intersect(topLevels);
                if (occuringParents.Any())
                {
                    return occuringParents.Append(child);
                }
                logger.LogError($"Missing parent category for {child.Id}-{child.InternalName} in similar products [{ToString(similarProducts)}]");
            }

            logger.LogError($"Couldn't inherit categorization due to missing parent category in similar products [{ToString(similarProducts)}]");
            return new Category[] { };
        }

        private IEnumerable<Category> TryGuessChildren(IEnumerable<Category> parentSPriceCategories, IEnumerable<Product> similarProducts)
        {
            var similarProductsChildCategories = GetCategories(similarProducts).Where(cat => cat.IsChild());
            var seekedChildren = GetChildren(parentSPriceCategories);
            return seekedChildren.Intersect(similarProductsChildCategories);
        }

        private IEnumerable<Category> TryGuessParents(IEnumerable<Category> childSPriceCategories, IEnumerable<Product> similarProducts)
        {
            var similarProductsParentCategories = GetCategories(similarProducts).Where(cat => cat.IsTopLevel());
            var seekedParents = GetParents(childSPriceCategories);
            return seekedParents.Intersect(similarProductsParentCategories);
        }

        private bool AddNewCategoriesToProduct(Product product, IEnumerable<Category> inputCategories)
        {
            var productCategories = GetCategories(product);
            var inputCategoriesToAdd = inputCategories.Except(productCategories).ToHashSet();
            foreach (var category in inputCategoriesToAdd)
            {
                var categoryToAdd = GetExistingOrReturnNew(category);
                product.ProductCategories.Add(new ProductCategory
                {
                    Product = product,
                    Category = categoryToAdd
                });
            }

            return inputCategoriesToAdd.Any();
        }

        private IEnumerable<Category> GetDefiniteParents(IEnumerable<Category> childCategories)
        {
            return childCategories
                .Where(child => child.CategoryParentCategories.Count == 1)
                .Select(childWithADefiniteParent => childWithADefiniteParent.CategoryParentCategories.First().Parent);
        }

        private Category GetDefiniteParent(Category child)
        {
            if (child.CategoryParentCategories.Count() == 1)
            {
                return child.CategoryParentCategories.First().Parent;
            }
            else
            {
                return null;
            }
        }

        private bool IsAnyParentPresent(IEnumerable<Category> presentChildCategories, IEnumerable<Category> presentParentCategories)
        {
            return GetParents(presentChildCategories).Intersect(presentParentCategories).Any();
        }

        private IEnumerable<Category> GetParents(IEnumerable<Category> categories)
        {
            var parents = new List<Category>();
            foreach (var cat in categories)
            {
                parents.AddRange(cat.CategoryParentCategories.Select(catParCat => catParCat.Parent));
            }
            return parents;
        }

        private IEnumerable<Category> GetChildren(IEnumerable<Category> categories)
        {
            var children = new List<Category>();
            foreach (var cat in categories)
            {
                children.AddRange(cat.CategoryParentParents.Select(catParPar => catParPar.Category));
            }
            return children;
        }

        private void ReplaceWithExistingCategoriesAndRemoveDuplicates(Product product)
        {
            var productCategories = product.ProductCategories.ToList();
            productCategories.ForEach(prodCat => prodCat.Category = GetExistingOrReturnNew(prodCat.Category));
            product.ProductCategories = productCategories.ToHashSet();
        }


        private IEnumerable<Category> GetMappedCategories(IEnumerable<Category> categories, Vendor vendor)
        {
            return repositoryContext.CategoryMappings.Map(categories, vendor);
        }

        private Category GetExistingOrReturnNew(Category inputCategory)
        {
            var existingCategory = repositoryContext.Categories.Get(c => c.InternalName == inputCategory.InternalName);
            return (existingCategory == null) ? inputCategory : existingCategory;
        }

        private IEnumerable<Category> GetCategories(Product product)
        {
            return product.ProductCategories.Select(prodCat => prodCat.Category);
        }

        private IEnumerable<Category> GetCategories(IEnumerable<Product> products)
        {
            var categories = new List<Category>();
            foreach (var product in products)
            {
                categories.AddRange(GetCategories(product));
            }
            return categories;
        }

        //FIXME: move ToString methods to helper functions

        private string ToString(IEnumerable<Category> categories)
        {
            return string.Join(',', categories.Select(cat => cat.Id + "-" + cat.InternalName));
        }

        private string ToString(IEnumerable<Product> products)
        {
            return string.Join(',', products.Select(prod => prod.Id + "-" + prod.Name));
        }

    }
}