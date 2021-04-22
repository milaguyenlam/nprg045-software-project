using Backend.Models.Database;
using System.Collections.Generic;
using Backend.Repositories;
using System.Linq;
using AutoMapper;
using Backend.Common;
using Microsoft.Extensions.Logging;
using System;
using Backend.Models.Import;
using System.Threading.Tasks;


namespace Backend.Services
{
    public interface IImportService
    {
        Task<bool> AddOffers(IEnumerable<Backend.Models.Crawler.OfferInput> inputOffers);
        Task<bool> AddProducts(IEnumerable<Backend.Models.Crawler.ProductInput> products, string vendorName);
        bool AddCategoryDefinitions(IEnumerable<CategoryDefinition> categoryDefinitions);
        bool AddCategoryMappings(IEnumerable<CategoryMappingDefinition> categoryMappings);
    }

    public class ImportService : IImportService
    {

        private readonly IRepositoryContext repositoryContext;
        private readonly ILogger logger;
        private readonly IMapper mapper;

        private readonly IProductIdentityService identificationService;

        public ImportService(
            IProductIdentityService identificationService,
            IRepositoryContext repositoryContext,
            ILogger<ImportService> logger,
            IMapper mapper)
        {
            this.repositoryContext = repositoryContext;
            this.mapper = mapper;
            this.logger = logger;
            this.identificationService = identificationService;
        }

        public async Task<bool> AddProducts(IEnumerable<Backend.Models.Crawler.ProductInput> products, string vendorName)
        {
            bool allAdded = true;
            foreach (var prod in products)
            {
                try
                {
                    allAdded &= await AddProduct(prod, vendorName);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Could not add product {prod.Name}");
                    allAdded = false;
                }
            }
            return allAdded;
        }

        private async Task<bool> AddProduct(Backend.Models.Crawler.ProductInput inputProduct, string vendorName)
        {
            Vendor vendor = repositoryContext.Vendors.Get(v => v.Name == vendorName);
            if (vendor == null)
            {
                throw new NullReferenceException($"Cannot find existing Vendor: {vendorName}");
            }

            var prodIdentityRes = await identificationService.IdentifyAndCategorize(
                mapper.Map<Backend.Models.Crawler.Product, Product>(inputProduct),
                vendor
            );
            var productToAdd = prodIdentityRes.product;

            var updatedProductInfo = UpdateProductData(inputProduct, productToAdd);
            if (
                prodIdentityRes.state == ProductIdentificationResult.State.Identical &&
                !(updatedProductInfo || prodIdentityRes.updatedProductCategorization))
            {
                logger.LogWarning($"Product {inputProduct.Name} was not added/updated because it already exists.");
                return false;
            }

            if (prodIdentityRes.state == ProductIdentificationResult.State.Identical)
            {
                repositoryContext.Products.Update(productToAdd);
            }
            else
            {
                repositoryContext.Products.Add(productToAdd);
            }

            repositoryContext.CommitAll();
            logger.LogInformation($"Product {inputProduct.Name} was added, ID: {productToAdd.Id}");

            return true;
        }

        private Backend.Models.Database.Category CreateCategory(string csName, string picturePath)
        {
            var cat = new Backend.Models.Database.Category
            {
                InternalName = csName,
                PicturePath = picturePath
            };
            var csLangId = repositoryContext.Languages.Get(lang => lang.Code.ToLower().Equals("cs")).Id;
            cat.CategoryTrans.Add(new CategoryTran
            {
                LanguageId = csLangId,
                Name = csName
            });
            repositoryContext.Categories.Add(cat);

            return cat;
        }

        private void AddCategoryDefinition(CategoryDefinition inputCategoryDefinition)
        {
            var category = inputCategoryDefinition.Category;
            var existingCategory = repositoryContext.Categories.Get(
                cat => (cat.InternalName.Equals(category.Name))
            );
            var categoryToAdd = existingCategory == null ? CreateCategory(category.Name, category.PicturePath) : existingCategory;

            foreach (var subCategory in inputCategoryDefinition.SubCategories)
            {
                var existingSubCategory = repositoryContext.Categories.Get(
                    cat => (cat.InternalName.Equals(subCategory.Name))
                );
                var subCategoryToAdd = existingSubCategory == null ? CreateCategory(subCategory.Name, subCategory.PicturePath) : existingSubCategory;
                repositoryContext.CategoryParents.Add(new CategoryParent
                {
                    Parent = categoryToAdd,
                    Category = subCategoryToAdd
                });
            }
        }

        public bool AddCategoryDefinitions(IEnumerable<CategoryDefinition> inputCategoryDefinitions)
        {
            try
            {
                foreach (var categoryDefinition in inputCategoryDefinitions)
                {
                    AddCategoryDefinition(categoryDefinition);
                    repositoryContext.CommitAll();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Could not add category definitions.");
                return false;
            }

            return true;
        }

        private void AddCategoryMapping(CategoryMappingDefinition categoryMapping)
        {
            logger.LogInformation($"Creating mapping for {categoryMapping.VendorName}");

            var vendor = repositoryContext.Vendors.Get(v => v.Name == categoryMapping.VendorName);
            if (vendor == null)
            {
                vendor = new Vendor
                {
                    Name = categoryMapping.VendorName,
                    ThumbnailPath = categoryMapping.VendorThumbnailPath
                };
                repositoryContext.Vendors.Add(vendor);
                logger.LogInformation($"Vendor {vendor.Name} did not exist, created one.");
            }

            foreach (var mapping in categoryMapping.Mapping.ToHashSet())
            {
                foreach (var catName in mapping.SPrice)
                {
                    Backend.Models.Database.Category category;
                    if ((category = repositoryContext.Categories.Get(c => c.InternalName == catName)) == null)
                    {
                        throw new ArgumentException($"Cannot create mapping for nonexisting category {catName}");
                    }

                    if (mapping.Foreign == null)
                    {
                        logger.LogWarning($"There's no mapping from foreign category to {catName}");
                        continue;
                    }
                    logger.LogInformation($"Creating mapping for {mapping.Foreign}");

                    repositoryContext.CategoryMappings.Add(vendor, mapping.Foreign, category);
                }
            }
        }

        public bool AddCategoryMappings(IEnumerable<CategoryMappingDefinition> categoryMappings)
        {
            try
            {
                foreach (var categoryMapping in categoryMappings)
                {
                    AddCategoryMapping(categoryMapping);
                }
                repositoryContext.CommitAll();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"Could not add category mapping");
                return false;
            }

            return true;
        }

        public async Task<bool> AddOffers(IEnumerable<Backend.Models.Crawler.OfferInput> inputOffers)
        {
            bool allAdded = true;
            foreach (var inputOffer in inputOffers)
            {
                try
                {
                    allAdded &= await AddOffer(inputOffer);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Could not add offer {inputOffer.Source}");
                    allAdded = false;
                }
            }
            return allAdded;
        }

        private async Task<bool> AddOffer(Backend.Models.Crawler.OfferInput inputOffer)
        {
            logger.LogInformation($"Adding offer: {inputOffer.Source}");

            Vendor vendor = repositoryContext.Vendors.Get(v => v.Name == inputOffer.Store.Vendor.Name);
            if (vendor == null)
            {
                throw new NullReferenceException($"Cannot find existing Vendor: {inputOffer.Store.Vendor.Name}");
            }

            var offerToAdd = mapper.Map<Backend.Models.Crawler.Offer, ActiveOffer>(inputOffer);
            if (inputOffer.ToDate == null)
            {
                offerToAdd.ToDate = System.DateTime.Today.AddDays(1);
            }
            if (inputOffer.FromDate == null)
            {
                offerToAdd.FromDate = System.DateTime.Today;
            }

            Store existingStore;
            ActiveOffer existingOffer;
            var prodIdentityRes = await identificationService.IdentifyAndCategorize(
                offerToAdd.Product,
                vendor
            );

            var existingSourceOffer = repositoryContext.ActiveOffers.Get(activeOffer => activeOffer.Source.Equals(inputOffer.Source));
            if (existingSourceOffer != null)
            {
                existingStore = existingSourceOffer.Store;
                existingOffer = existingSourceOffer;
            }
            else
            {
                var existingProduct = prodIdentityRes.state == ProductIdentificationResult.State.Identical ? prodIdentityRes.product : null;
                existingStore = repositoryContext.Stores.Get(store =>
                    store.Vendor.Name.Equals(offerToAdd.Store.Vendor.Name) &&
                    store.ContactDetails.Geolocation.EqualsTopologically(offerToAdd.Store.ContactDetails.Geolocation)
                );
                existingOffer = existingProduct != null && existingStore != null ?
                    repositoryContext.ActiveOffers.Get(activeOffer =>
                        (activeOffer.FromDate <= offerToAdd.FromDate && offerToAdd.FromDate <= activeOffer.ToDate)
                        && activeOffer.Store.Equals(existingStore)
                        && activeOffer.Product.Equals(existingProduct)
                    )
                    : null;
            }

            //just updating existing offer or conflict resolution
            if (existingOffer != null)
            {
                var offerUpdateNeeded = UpdateExistingOfferData(offerToAdd, existingOffer);
                var updatedProductInfo = UpdateProductData(inputOffer.Product, existingOffer.Product);

                if (offerUpdateNeeded || prodIdentityRes.updatedProductCategorization || updatedProductInfo)
                {
                    repositoryContext.ActiveOffers.Update(existingOffer);
                    repositoryContext.CommitAll();
                    logger.LogInformation($"Offer data updated to DB, source: {inputOffer.Source}");
                    return true;
                }

                if (existingOffer.Source != offerToAdd.Source)
                {
                    var message = $"Problem when adding {inputOffer.Source}\n" +
                        $"There's already a product with existing name {offerToAdd.Product.Name} but different source: {existingOffer.Source}";
                    logger.LogError(message);
                    return false;
                }

                logger.LogInformation($"Not added: {inputOffer.Source}. There's already such offer.");
                return false;
            }

            //adding new offer
            else
            {
                var existingVendor = repositoryContext.Vendors.Get(vendor => vendor.Name.Equals(offerToAdd.Store.Vendor.Name));
                if (existingVendor != null)
                {
                    offerToAdd.Store.Vendor = existingVendor;
                }

                if (existingStore != null)
                {
                    offerToAdd.Store = existingStore;
                }
                else
                {
                    offerToAdd.Store.ContactDetails.Name = "Store - " + inputOffer.Store.Vendor.Name + " @ " + offerToAdd.Store.ContactDetails.Geolocation.ToString();
                }

                repositoryContext.ActiveOffers.Add(offerToAdd);
                repositoryContext.CommitAll();

                logger.LogInformation($"Offer added: {inputOffer.Source}, new offer ID: {offerToAdd.Id}");
                return true;
            }

        }

        private bool UpdateExistingOfferData(ActiveOffer offerToAdd, ActiveOffer existingOffer)
        {
            var updateNeeded = false;
            if (existingOffer.ToDate < offerToAdd.ToDate)
            {
                existingOffer.ToDate = offerToAdd.ToDate;
                updateNeeded = true;
            }

            if (existingOffer.ToDate < offerToAdd.FromDate)
            {
                existingOffer.FromDate = offerToAdd.FromDate;
                updateNeeded = true;
            }

            if (existingOffer.Price != offerToAdd.Price)
            {
                existingOffer.Price = offerToAdd.Price;
                updateNeeded = true;
            }

            if (existingOffer.InStockCount != offerToAdd.InStockCount)
            {
                existingOffer.InStockCount = offerToAdd.InStockCount;
                updateNeeded = true;
            }

            if (existingOffer.Description != offerToAdd.Description)
            {
                existingOffer.Description = offerToAdd.Description;
                updateNeeded = true;
            }

            if (existingOffer.DiscountRate != offerToAdd.DiscountRate)
            {
                existingOffer.DiscountRate = offerToAdd.DiscountRate;
                updateNeeded = true;
            }

            if (existingOffer.IsTaxed != offerToAdd.IsTaxed)
            {
                existingOffer.IsTaxed = offerToAdd.IsTaxed;
                updateNeeded = true;
            }

            return updateNeeded;
        }

        private bool UpdateProductData(Backend.Models.Crawler.Product inputProduct, Product productToAdd)
        {
            bool updated = false;

            if (inputProduct.Producer != null)
            {
                updated = productToAdd.ProducerId == null || inputProduct.Producer.Name != productToAdd.Producer.Name;
                var existingProducer = repositoryContext.Producers.Get(producer =>
                    producer.Name.Equals(inputProduct.Producer.Name)
                );
                if (existingProducer != null)
                {
                    productToAdd.Producer = existingProducer;
                }
                else
                {
                    productToAdd.Producer = mapper.Map<Backend.Models.Crawler.Producer, Producer>(inputProduct.Producer);
                }
            }

            if (inputProduct.EAN != null && inputProduct.EAN != productToAdd.Ean)
            {
                productToAdd.Ean = inputProduct.EAN;
                updated = true;
            }

            return updated;
        }

    }
}