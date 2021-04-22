import {
  useAddToFavouriteList,
  GetFavouriteList,
  GetFavouriteListDocument,
  useRemoveFromFavouriteList,
  useAddToShoppingList,
  GetShoppingListItems,
  GetShoppingListItemsDocument,
  useRemoveFromShoppingList,
  useUpdateShoppingListItem,
} from "./generated";

export const UseAddToFavouriteListWrapper = useAddToFavouriteList({
  update(cache, element) {
    const newFavlistItem = element.data?.addToFavouriteList;
    const existingFavlist = cache.readQuery<GetFavouriteList>({
      query: GetFavouriteListDocument,
    });
    //TODO: Also set inFavouriteList flag in GetActiveProducts products
    //It might be done by Apollo cache mechanism already
    if (existingFavlist && newFavlistItem) {
      cache.writeQuery({
        query: GetFavouriteListDocument,
        data: {
          favouriteList: [...existingFavlist.favouriteList, newFavlistItem],
        },
      });
    }
  },
});

export const UseRemoveFromFavouriteListWrapper = useRemoveFromFavouriteList({
  update(cache, element) {
    const deletedId = element.data?.removeFromFavouriteList.id;
    const existingFavlist = cache.readQuery<GetFavouriteList>({
      query: GetFavouriteListDocument,
    });
    //TODO: Also set inFavouriteList flag in GetActiveProducts products
    //It might be done by Apollo cache mechanism already
    cache.writeQuery({
      query: GetFavouriteListDocument,
      data: {
        favouriteList: existingFavlist?.favouriteList.filter(
          (item) => item.id !== deletedId
        ),
      },
    });
    //FIXME: learn about evict() and why is id a string?
    cache.evict({ id: element.data?.removeFromFavouriteList.id.toString() });
  },
});

export const UseAddToShoppingListWrapper = useAddToShoppingList({
  update(cache, element) {
    const newShoppingListItem = element.data?.addToShoppingList;
    const existingShoppingList = cache.readQuery<GetShoppingListItems>({
      query: GetShoppingListItemsDocument,
    });

    if (existingShoppingList && newShoppingListItem) {
      cache.writeQuery({
        query: GetShoppingListItemsDocument,
        data: {
          shoppingList: [
            ...existingShoppingList.shoppingListItems,
            newShoppingListItem,
          ],
        },
      });
    }
  },
});

export const UseRemoveFromShoppingListWrapper = useRemoveFromShoppingList({
  update(cache, element) {
    const deletedId = element.data?.removeFromShoppingList.id;
    const existingShoppingList = cache.readQuery<GetShoppingListItems>({
      query: GetShoppingListItemsDocument,
    });
    cache.writeQuery({
      query: GetShoppingListItemsDocument,
      data: {
        shoppingList: existingShoppingList?.shoppingListItems.filter(
          (item) => item.id !== deletedId
        ),
      },
    });
    //FIXME: learn about evict() and why is id a string?
    cache.evict({ id: element.data?.removeFromShoppingList.id.toString() });
  },
});

export const UseUpdateShoppingListItemWrapper = useUpdateShoppingListItem();
