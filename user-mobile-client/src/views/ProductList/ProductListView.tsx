import { Container } from "native-base";
import React, { FC, useEffect, useState } from "react";

import ProductList from "./ProductList";
import TopBar from "./TopBar";
import {
  ProductListViewNavigationProp,
  ProductListViewRouteProp,
} from "../../navigation_types";
import {
  GetFavouriteList,
  GetFavouriteListDocument,
  GetShoppingListItems,
  GetShoppingListItemsDocument,
  useAddToFavouriteList,
  useAddToShoppingList,
  useGetActiveProducts,
  useGetFavouriteList,
  useGetSelectionItems,
  useGetShoppingListItems,
  useRemoveFromFavouriteList,
  useRemoveFromShoppingList,
  useUpdateShoppingListItem,
} from "../../../services/generated";
import RemoveFilterFab from "./RemoveFilterFab";
import NavigationBar from "../Sales/NavigationBar";
import SplashScreenView from "../SplashScreen/SplashScreenView";

export interface ProductListViewProps {
  navigation: ProductListViewNavigationProp;
  route: ProductListViewRouteProp;
}

export interface ProductListViewState {
  offset: number;
}

export const productsOnPageLimit = 10;

const ProductListView: FC<ProductListViewProps> = (
  props: ProductListViewProps
) => {
  const [state, setState] = useState<ProductListViewState>({
    offset: productsOnPageLimit,
  });
  const getActiveProductsResult = useGetActiveProducts({
    variables: {
      offset: 0,
      limit: productsOnPageLimit,
      vendorId: props.route.params.selectedVendorId,
      categoryIds: props.route.params.selectedCategoryIds,
      filterType: props.route.params.selectedFilterType,
    },
  });

  const getTopSelectionViewResult = useGetSelectionItems();
  const getShoppingListResult = useGetShoppingListItems();
  const getFavouriteListResult = useGetFavouriteList();

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
      //FIXME: learn about evict() and why is id a string?
      cache.evict({ id: element.data?.removeFromShoppingList.id.toString() });
    },
  });

  const [updateShoppingListItem] = useUpdateShoppingListItem();

  //FIXME: hook exception
  // const [addToFavouriteList] = UseAddToFavouriteListWrapper;
  // const [removeFromFavouriteList] = UseRemoveFromFavouriteListWrapper;

  //FIXME: useEffect might not function correctly on selectedCategoryIds
  useEffect(() => {
    getActiveProductsResult.refetch({
      offset: 0,
      limit: productsOnPageLimit,
      vendorId: props.route.params.selectedVendorId,
      categoryIds: props.route.params.selectedCategoryIds,
      filterType: props.route.params.selectedFilterType,
    });
    setState({
      offset: productsOnPageLimit,
    });
  }, [
    props.route.params.selectedVendorId,
    props.route.params.selectedCategoryIds,
    props.route.params.selectedFilterType,
  ]);

  if (
    getTopSelectionViewResult.loading ||
    getShoppingListResult.loading ||
    getFavouriteListResult.loading ||
    getActiveProductsResult.loading
  ) {
    return <SplashScreenView />;
  }

  return (
    <Container>
      <TopBar navigation={props.navigation} route={props.route} />
      <Container>
        <ProductList
          shoppingList={getShoppingListResult.data?.shoppingListItems}
          addToShoppingList={addToShoppingList}
          updateShoppingListItem={updateShoppingListItem}
          favouriteList={getFavouriteListResult.data?.favouriteList}
          navigation={props.navigation}
          products={getActiveProductsResult.data?.activeProducts}
          loading={getActiveProductsResult.loading}
          error={getActiveProductsResult.error}
          fetchMoreActiveProducts={getActiveProductsResult.fetchMore}
          offset={state.offset}
          setState={setState}
          addToFavouriteList={addToFavouriteList}
          removeFromFavouriteList={removeFromFavouriteList}
        />
        <RemoveFilterFab navigation={props.navigation} route={props.route} />
      </Container>
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

export default ProductListView;
