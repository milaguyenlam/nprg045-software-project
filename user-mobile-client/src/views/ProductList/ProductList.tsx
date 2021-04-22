import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Content } from "native-base";
import ProductCard from "./ProductCard";
import {
  FavouriteListItem_GetFavouriteList,
  GetFavouriteList,
  GetShoppingListItems,
  Product_GetActiveProducts,
  ShoppingListItem_GetShoppingListItems,
} from "../../../services/generated";
import { ProductListViewNavigationProp } from "../../navigation_types";
import { ApolloError } from "@apollo/client";
import { ProductListViewState } from "./ProductListView";
import LoadMoreCard from "./LoadMoreCard";
import ErrorPage from "../../shared/ErrorPage";
import SplashScreenView from "../SplashScreen/SplashScreenView";
import { contentBackgroundColor } from "../../shared/ViewConfig";

export interface ProductListProps {
  navigation: ProductListViewNavigationProp;
  products: Product_GetActiveProducts[] | undefined;
  error: ApolloError | undefined;
  loading: boolean;
  fetchMoreActiveProducts: Function;
  offset: number;
  setState: React.Dispatch<React.SetStateAction<ProductListViewState>>;
  addToFavouriteList: Function;
  removeFromFavouriteList: Function;
  shoppingList: ShoppingListItem_GetShoppingListItems[] | undefined;
  addToShoppingList: Function;
  updateShoppingListItem: Function;
  favouriteList: FavouriteListItem_GetFavouriteList[] | undefined;
}

export interface ProductListState {}

const ProductList: FC<ProductListProps> = (props: ProductListProps) => {
  if (props.loading) {
    return <SplashScreenView />;
  }
  if (props.error) {
    return <ErrorPage navigation={props.navigation} error={props.error} />;
  }
  return (
    <Content
      style={styles.content}
      contentContainerStyle={styles.productContainer}
    >
      {props.products?.map((p, index) => (
        <ProductCard
          product={p}
          key={index}
          navigation={props.navigation}
          inFavouriteList={isInFavouriteList}
          addToFavouriteList={props.addToFavouriteList}
          removeFromFavouriteList={props.removeFromFavouriteList}
          addToShoppingList={props.addToShoppingList}
          updateShoppingListItem={props.updateShoppingListItem}
        />
      ))}
      <LoadMoreCard
        fetchModeActiveProducts={props.fetchMoreActiveProducts}
        offset={props.offset}
        setState={props.setState}
        loading={props.loading}
      />
    </Content>
  );

  function isInFavouriteList(product: Product_GetActiveProducts): boolean {
    const idList = props.favouriteList?.map((fav) => fav.product.id);
    return idList?.includes(product.id) || false;
  }
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: contentBackgroundColor,
  },
  content: {
    backgroundColor: contentBackgroundColor,
  },
  loadingSpinner: {},
});

export default ProductList;
