using System.Collections.Generic;
using Backend.Models.Database;
using Backend.Repositories;

namespace Backend.Services
{
    public interface IFavouriteListService
    {
        IEnumerable<FavouriteListItem> GetFavouriteList(int userId);
        FavouriteListItem AddToFavouriteList(int userId, int productId);
        FavouriteListItem RemoveFromFavouriteList(int userId, int productId);
    }

    public class FavouriteListService : IFavouriteListService
    {
        private readonly IRepositoryContext repositoryContext;
        public FavouriteListService(IRepositoryContext repositoryContext)
        {
            this.repositoryContext = repositoryContext;
        }


        public IEnumerable<FavouriteListItem> GetFavouriteList(int userId)
        {
            return repositoryContext.FavouriteListItems.GetMany(item => item.UserId == userId);
        }

        public FavouriteListItem AddToFavouriteList(int userId, int productId)
        {
            var item = new FavouriteListItem
            {
                UserId = userId,
                Product = repositoryContext.Products.GetByPrimaryKeys(productId)
            };
            repositoryContext.FavouriteListItems.Add(item);
            repositoryContext.CommitAll();
            return item;
        }

        public FavouriteListItem RemoveFromFavouriteList(int userId, int productId)
        {
            var item = repositoryContext.FavouriteListItems.Get(item => (item.UserId == userId && item.ProductId == productId));
            repositoryContext.FavouriteListItems.Delete(item);
            repositoryContext.CommitAll();
            return item;
        }
    }
}