using Backend.Models.Database;
using Microsoft.Extensions.Configuration;

namespace Backend.Repositories
{

    /**
     IRepositoryContext serves to scope all repositories in a single database context.
     Overall it provides access and unit of work unification across all repositories per one request.
     This is not thread safe if you manually spawn threads in a request (which you shouldn't do anyway).
     **/
    public interface IRepositoryContext
    {
        ASDocMappingRepository ASDocMappings { get; }
        IDbChangeRepository DbChanges { get; }
        IEntityRepository<Category> Categories { get; }
        IEntityRepository<CategoryTran> CategoryTrans { get; }
        IEntityRepository<CategoryParent> CategoryParents { get; }
        IEntityRepository<ProductCategory> ProductCategories { get; }
        IEntityRepository<Product> Products { get; }
        IEntityRepository<ActiveOffer> ActiveOffers { get; }
        IEntityRepository<Store> Stores { get; }
        IEntityRepository<Vendor> Vendors { get; }
        IEntityRepository<Producer> Producers { get; }
        IEntityRepository<ContactDetail> ContactDetails { get; }
        IEntityRepository<Language> Languages { get; }
        IEntityRepository<FavouriteListItem> FavouriteListItems { get; }
        IEntityRepository<ShoppingListItem> ShoppingListItems { get; }
        IEntityRepository<ShoppingList> ShoppingLists { get; }
        ASRepository AppSearch { get; }
        ICategoryMappingRepository CategoryMappings { get; }
        //To commit all changes made in all repositories.
        void CommitAll();
    }

    public class RepositoryContext : IRepositoryContext
    {
        private readonly IConfiguration configuration;
        private readonly SPriceContext dbContext;
        private ASDocMappingRepository asDocMappingRepo;
        private IDbChangeRepository dbChangeRepo;
        private IEntityRepository<Category> categoryRepo;
        private IEntityRepository<CategoryParent> categoryParentRepo;
        private IEntityRepository<CategoryTran> categoryTrans;
        private IEntityRepository<ProductCategory> productCategoryRepo;
        private IEntityRepository<Product> productRepo;
        private IEntityRepository<ActiveOffer> activeOfferRepo;
        private IEntityRepository<Store> storeRepo;
        private IEntityRepository<Vendor> vendorRepo;
        private IEntityRepository<Producer> producerRepo;
        private IEntityRepository<ContactDetail> contactDetailsRepo;
        private IEntityRepository<Language> languageRepo;
        private IEntityRepository<FavouriteListItem> favouriteListItemRepo;
        private IEntityRepository<ShoppingListItem> shoppingListItemRepo;
        private IEntityRepository<ShoppingList> shoppingListRepo;
        private ASRepository asRepository;
        private ICategoryMappingRepository categoryMappingRepo;

        public IEntityRepository<CategoryTran> CategoryTrans
        {
            get { return categoryTrans ??= new EntityRepository<CategoryTran>(dbContext); }
        }
        public IEntityRepository<Language> Languages
        {
            get { return languageRepo ??= new EntityRepository<Language>(dbContext); }
        }

        public IEntityRepository<ContactDetail> ContactDetails
        {
            get { return contactDetailsRepo ??= new EntityRepository<ContactDetail>(dbContext); }
        }

        public IEntityRepository<ActiveOffer> ActiveOffers
        {
            get { return activeOfferRepo ??= new EntityRepository<ActiveOffer>(dbContext); }
        }

        public IEntityRepository<ProductCategory> ProductCategories
        {
            get { return productCategoryRepo ??= new EntityRepository<ProductCategory>(dbContext); }
        }

        public IEntityRepository<Category> Categories
        {
            get { return categoryRepo ??= new EntityRepository<Category>(dbContext); }
        }

        public IEntityRepository<CategoryParent> CategoryParents
        {
            get { return categoryParentRepo ??= new EntityRepository<CategoryParent>(dbContext); }
        }

        public IEntityRepository<Product> Products
        {
            get { return productRepo ??= new EntityRepository<Product>(dbContext); }
        }

        public IEntityRepository<Store> Stores
        {
            get { return storeRepo ??= new EntityRepository<Store>(dbContext); }
        }

        public IEntityRepository<Vendor> Vendors
        {
            get { return vendorRepo ??= new EntityRepository<Vendor>(dbContext); }
        }

        public IEntityRepository<Producer> Producers
        {
            get { return producerRepo ??= new EntityRepository<Producer>(dbContext); }
        }

        public IEntityRepository<FavouriteListItem> FavouriteListItems
        {
            get { return favouriteListItemRepo ??= new EntityRepository<FavouriteListItem>(dbContext); }
        }

        public IEntityRepository<ShoppingListItem> ShoppingListItems
        {
            get { return shoppingListItemRepo ??= new EntityRepository<ShoppingListItem>(dbContext); }
        }

        public IEntityRepository<ShoppingList> ShoppingLists
        {
            get { return shoppingListRepo ??= new EntityRepository<ShoppingList>(dbContext); }
        }

        public ASDocMappingRepository ASDocMappings
        {
            get { return asDocMappingRepo ??= new ASDocMappingRepository(dbContext); }
        }

        public IDbChangeRepository DbChanges
        {
            get { return dbChangeRepo ??= new DbChangeRepository(dbContext); }
        }

        public ASRepository AppSearch
        {
            get { return asRepository ??= new ASRepository(configuration); }
        }

        public ICategoryMappingRepository CategoryMappings
        {
            get { return categoryMappingRepo ??= new CategoryMappingRepository(dbContext); }
        }

        public RepositoryContext(SPriceContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
        }

        public void CommitAll()
        {
            dbContext.SaveChanges();
        }
    }
}
