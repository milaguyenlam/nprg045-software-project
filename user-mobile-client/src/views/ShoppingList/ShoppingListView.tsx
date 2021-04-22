import { Container } from "native-base";
import React, { FC, useEffect, useState } from "react";
import {
  ShoppingListViewNavigationProp,
  ShoppingListViewRouteProp,
} from "../../navigation_types";
import ShoppingListPage from "./ShoppingListPage";
import TopBar from "./TopBar";
import {
  GetShoppingListItems,
  GetShoppingListItemsDocument,
  useAddToShoppingList,
  useGetShoppingListItems,
  useRemoveFromShoppingList,
  useUpdateShoppingListItem,
} from "../../../services/generated";
import NavigationBar from "./NavigationBar";

export interface ShoppingListViewProps {
  navigation: ShoppingListViewNavigationProp;
  route: ShoppingListViewRouteProp;
}

export interface ShoppingListViewState {
  shouldFetch: boolean;
}

const ShoppingListView: FC<ShoppingListViewProps> = (
  props: ShoppingListViewProps
) => {
  const [state, setState] = useState<ShoppingListViewState>({
    shouldFetch: true,
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
            shoppingListItems: [
              ...existingShoppingList.shoppingListItems,
              newShoppingListItem,
            ],
          },
        });
      }
    },
  });
  const [removeFromShoppingList] = useRemoveFromShoppingList({
    update(cache, element) {
      const deletedId = element.data?.removeFromShoppingList.id;
      const existingShoppingList = cache.readQuery<GetShoppingListItems>({
        query: GetShoppingListItemsDocument,
      });
      cache.writeQuery({
        query: GetShoppingListItemsDocument,
        data: {
          shoppingListItems: existingShoppingList?.shoppingListItems.filter(
            (item) => item.id !== deletedId
          ),
        },
      });
      cache.evict({ id: element.data?.removeFromShoppingList.id.toString() });
    },
  });
  const [updateShoppingListItem] = useUpdateShoppingListItem();

  return (
    <Container>
      <TopBar navigation={props.navigation} />
      <Container>
        <ShoppingListPage
          navigation={props.navigation}
          shoppingListItems={getShoppingListResult.data?.shoppingListItems}
          loading={getShoppingListResult.loading}
          error={getShoppingListResult.error}
          refetch={getShoppingListResult.refetch}
          addToShoppingList={addToShoppingList}
          removeFromShoppingList={removeFromShoppingList}
          updateShoppingListItem={updateShoppingListItem}
        />
      </Container>
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

export default ShoppingListView;
