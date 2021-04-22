import { Container } from "native-base";
import React, { FC, useEffect } from "react";
import ProductPage from "./ProductPage";
import TopBar from "./TopBar";
import {
  ProductListViewNavigationProp,
  ProductViewRouteProp,
} from "../../navigation_types";
import {
  GetFavouriteList,
  GetFavouriteListDocument,
  GetShoppingListItems,
  GetShoppingListItemsDocument,
  useAddToFavouriteList,
  useAddToShoppingList,
  useGetFavouriteList,
  useGetProduct,
  useGetShoppingListItems,
  useRemoveFromFavouriteList,
  useRemoveFromShoppingList,
  useUpdateShoppingListItem,
} from "../../../services/generated";
import NavigationBar from "../Sales/NavigationBar";

export interface ProductViewProps {
  navigation: ProductListViewNavigationProp;
  route: ProductViewRouteProp;
}

export interface ProductViewState {}

const ProductView: FC<ProductViewProps> = (props: ProductViewProps) => {
  const { loading, error, data, refetch } = useGetProduct({
    variables: {
      id: props.route.params.productId,
    },
  });

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

  const getShoppingListResult = useGetShoppingListItems();
  const getFavouriteListResult = useGetFavouriteList();

  useEffect(() => {
    refetch({
      id: props.route.params.productId,
    });
  }, [props.route.params.productId]);

  return (
    <Container>
      <TopBar navigation={props.navigation} productName={data?.product?.name} />
      <ProductPage
        navigation={props.navigation}
        product={data?.product}
        loading={loading}
        error={error}
        addToShoppingList={addToShoppingList}
        removeFromShoppingList={removeFromShoppingList}
        updateShoppingListItem={updateShoppingListItem}
        addToFavouriteList={addToFavouriteList}
        removeFromFavouriteList={removeFromFavouriteList}
        favouriteList={getFavouriteListResult.data?.favouriteList}
        shoppingList={getShoppingListResult.data?.shoppingListItems}
      />
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

export default ProductView;
