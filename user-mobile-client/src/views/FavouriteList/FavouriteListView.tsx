import { Container } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import {
  FavouriteListViewNavigationProp,
  FavouriteListViewRouteProp,
} from "../../navigation_types";
import TopBar from "./TopBar";
import FavouriteListPage from "./FavouriteListPage";
import {
  GetFavouriteList,
  GetFavouriteListDocument,
  GetShoppingListItems,
  GetShoppingListItemsDocument,
  useAddToFavouriteList,
  useAddToShoppingList,
  useGetFavouriteList,
  useGetShoppingListItems,
  useRemoveFromFavouriteList,
  useRemoveFromShoppingList,
  useUpdateShoppingListItem,
} from "../../../services/generated";
import NavigationBar from "./NavigationBar";

export interface FavouriteListViewProps {
  navigation: FavouriteListViewNavigationProp;
  route: FavouriteListViewRouteProp;
}

export interface FavouriteListViewState {}

const FavouriteListView: FC<FavouriteListViewProps> = (
  props: FavouriteListViewProps
) => {
  const { loading, error, data } = useGetFavouriteList();

  const [addToFavouriteList] = useAddToFavouriteList({
    update(cache, element) {
      const newFavlistItem = element.data?.addToFavouriteList;
      const existingFavlist = cache.readQuery<GetFavouriteList>({
        query: GetFavouriteListDocument,
      });
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

  const [removeFromFavouriteList] = useRemoveFromFavouriteList({
    update(cache, element) {
      const deletedId = element.data?.removeFromFavouriteList.id;
      const existingFavlist = cache.readQuery<GetFavouriteList>({
        query: GetFavouriteListDocument,
      });
      cache.writeQuery({
        query: GetFavouriteListDocument,
        data: {
          favouriteList: existingFavlist?.favouriteList.filter(
            (item) => item.id !== deletedId
          ),
        },
      });
      cache.evict({ id: element.data?.removeFromFavouriteList.id.toString() });
    },
  });

  const getShoppingListResult = useGetShoppingListItems();

  const [addToShoppingList] = useAddToShoppingList({
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
  const [updateShoppingListItem] = useUpdateShoppingListItem();

  return (
    <Container>
      <TopBar navigation={props.navigation} />
      <FavouriteListPage
        error={error}
        loading={loading}
        navigation={props.navigation}
        favlistItems={data?.favouriteList}
        addToFavouriteList={addToFavouriteList}
        removeFromFavouriteList={removeFromFavouriteList}
        shoppingList={getShoppingListResult.data?.shoppingListItems}
        addToShoppingList={addToShoppingList}
        updateShoppingListItem={updateShoppingListItem}
      />
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default FavouriteListView;
