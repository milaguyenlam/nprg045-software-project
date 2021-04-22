using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Backend.Models.Database
{
    public partial class SPriceContext : DbContext
    {
        public SPriceContext()
        {
        }

        public SPriceContext(DbContextOptions<SPriceContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ActiveOffer> ActiveOffers { get; set; }
        public virtual DbSet<AsDocMapping> AsDocMappings { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRole> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CategoryMapping> CategoryMappings { get; set; }
        public virtual DbSet<CategoryParent> CategoryParents { get; set; }
        public virtual DbSet<CategoryTran> CategoryTrans { get; set; }
        public virtual DbSet<ContactDetail> ContactDetails { get; set; }
        public virtual DbSet<DbChange> DbChanges { get; set; }
        public virtual DbSet<FavouriteListItem> FavouriteListItems { get; set; }
        public virtual DbSet<Language> Languages { get; set; }
        public virtual DbSet<Producer> Producers { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductCategory> ProductCategories { get; set; }
        public virtual DbSet<ShoppingList> ShoppingLists { get; set; }
        public virtual DbSet<ShoppingListItem> ShoppingListItems { get; set; }
        public virtual DbSet<Store> Stores { get; set; }
        public virtual DbSet<Vendor> Vendors { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=Default", x => x.UseNetTopologySuite());
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
