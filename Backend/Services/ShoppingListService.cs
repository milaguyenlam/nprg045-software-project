using System.Collections.Generic;
using Backend.Models.Database;
using Backend.Repositories;
using static Backend.Models.Client.Types;
using System;
using System.Linq;


namespace Backend.Services
{
    public interface IShoppingListService
    {
        ShoppingListItem AddToShoppingList(int userId, ShoppingListItemAddInput item);
        ShoppingListItem UpdateShoppingListItem(int userId, ShoppingListItemUpdateInput item);
        ShoppingListItem RemoveFromShoppingList(int userId, int itemId);
        ShoppingList ArchiveShoppingList(int userId);
        ShoppingList RemoveShoppingList(int userId, int listId);
        IEnumerable<ShoppingList> GetShoppingLists(int userId);
        IEnumerable<ShoppingListItem> GetShoppingListItems(int userId, int? listId);
    }


    public class ShoppingListService : IShoppingListService
    {
        private readonly IRepositoryContext repositoryContext;
        public ShoppingListService(IRepositoryContext repositoryContext)
        {
            this.repositoryContext = repositoryContext;
        }

        private ShoppingList GetActiveShoppingList(int userId)
        {
            var activeShoppingList = repositoryContext.ShoppingLists.Get(sl => sl.UserId == userId && sl.CloseTime == null);
            if (activeShoppingList == null)
            {
                throw new Exception($"Could not find active shopping list for user {userId}");
            }

            return activeShoppingList;
        }

        private ActiveOffer GetActiveOffer(int activeOfferId)
        {
            var activeOffer = repositoryContext.ActiveOffers.GetByPrimaryKeys(activeOfferId);
            if (activeOffer == null)
            {
                throw new Exception($"Could not find offer with id {activeOfferId}");
            }

            return activeOffer;
        }

        public ShoppingListItem AddToShoppingList(int userId, ShoppingListItemAddInput itemToAdd)
        {
            //TODO: if such item already exists, then update quantity
            var activeShoppingList = GetActiveShoppingList(userId);
            var activeOffer = GetActiveOffer(itemToAdd.activeOfferId);
            var item = new ShoppingListItem
            {
                ShoppingListId = activeShoppingList.Id,
                ActiveOffer = activeOffer,
                Quantity = itemToAdd.quantity,
                State = (int)ShoppingListItemState.NEW
            };
            repositoryContext.ShoppingListItems.Add(item);
            repositoryContext.CommitAll();
            return item;
        }

        public ShoppingListItem UpdateShoppingListItem(int userId, ShoppingListItemUpdateInput item)
        {
            var activeShoppingList = GetActiveShoppingList(userId);
            var oldItem = activeShoppingList.ShoppingListItems.First(i => i.Id == item.id);
            if (oldItem == null)
            {
                throw new Exception($"Could not find shopping list item {item.id} in the active shopping list");
            }

            oldItem.Quantity = (int)(item.quantity ?? oldItem.Quantity);
            oldItem.State = item.state == null ? oldItem.State : (int)item.state;

            repositoryContext.ShoppingListItems.Update(oldItem);
            repositoryContext.CommitAll();

            return oldItem;
        }

        public ShoppingListItem RemoveFromShoppingList(int userId, int itemId)
        {
            var activeShoppingList = GetActiveShoppingList(userId);
            var item = activeShoppingList.ShoppingListItems.First(i => i.Id == itemId);
            if (item == null)
            {
                throw new Exception($"Could not find shopping list item {itemId} in the active shopping list");
            }

            repositoryContext.ShoppingListItems.Delete(item);
            repositoryContext.CommitAll();

            return item;
        }

        public IEnumerable<ShoppingListItem> GetShoppingListItems(int userId, int? listId)
        {
            ShoppingList shoppingList;
            if (listId == null)
            {
                shoppingList = GetActiveShoppingList(userId);
            }
            else
            {
                shoppingList = repositoryContext.ShoppingLists.Get(sl => sl.UserId == userId && sl.Id == listId);
            }
            return shoppingList.ShoppingListItems;
        }

        public IEnumerable<ShoppingList> GetShoppingLists(int userId)
        {
            return repositoryContext.ShoppingLists.GetMany(l => l.UserId == userId && l.State == (int)ShoppingListState.NORMAL);
        }

        public ShoppingList ArchiveShoppingList(int userId)
        {
            var oldShoppingList = GetActiveShoppingList(userId);
            oldShoppingList.CloseTime = DateTime.UtcNow;
            repositoryContext.ShoppingLists.Update(oldShoppingList);

            var newShoppingList = new ShoppingList
            {
                UserId = userId,
                CreationTime = DateTime.UtcNow
            };
            newShoppingList.SetState(ShoppingListState.NORMAL);
            repositoryContext.ShoppingLists.Add(newShoppingList);
            repositoryContext.CommitAll();

            return oldShoppingList;
        }

        public ShoppingList RemoveShoppingList(int userId, int listId)
        {
            var shoppingList = repositoryContext.ShoppingLists.Get(sl => sl.UserId == userId && sl.Id == listId && sl.CloseTime != null);
            if (shoppingList == null)
            {
                throw new Exception("The shopping list was not found or is still active");
            }

            shoppingList.SetState(ShoppingListState.SOFT_DELETED);
            repositoryContext.ShoppingLists.Update(shoppingList);
            repositoryContext.CommitAll();

            return shoppingList;
        }
    }
}