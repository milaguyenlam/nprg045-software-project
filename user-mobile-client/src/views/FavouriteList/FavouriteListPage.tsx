import { ApolloError } from "@apollo/client";
import { Content } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import {
  FavouriteListItem_GetFavouriteList,
  ShoppingListItem_GetShoppingListItems,
} from "../../../services/generated";
import { FavouriteListViewNavigationProp } from "../../navigation_types";
import SplashScreenView from "../SplashScreen/SplashScreenView";
import FavouriteListItemCard from "./FavouriteListItemCard";
import ErrorPage from "../../shared/ErrorPage";
import { contentBackgroundColor } from "../../shared/ViewConfig";

export interface FavouriteListPageProps {
  navigation: FavouriteListViewNavigationProp;
  error: ApolloError | undefined;
  loading: boolean;
  favlistItems: FavouriteListItem_GetFavouriteList[] | undefined;
  addToFavouriteList: Function;
  removeFromFavouriteList: Function;
  shoppingList: ShoppingListItem_GetShoppingListItems[] | undefined;
  addToShoppingList: Function;
  updateShoppingListItem: Function;
}

export interface FavouriteListPageState {}

//TODO: move contentBackgroundColor upwards in Config
const FavouriteListPage: FC<FavouriteListPageProps> = (
  props: FavouriteListPageProps
) => {
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
      {props.favlistItems?.map((item, index) => (
        <FavouriteListItemCard
          product={item.product}
          key={index}
          navigation={props.navigation}
          addToFavouriteList={props.addToFavouriteList}
          removeFromFavouriteList={props.removeFromFavouriteList}
          addToShoppingList={props.addToShoppingList}
          updateShoppingListItem={props.updateShoppingListItem}
          shoppingList={props.shoppingList}
        />
      ))}
    </Content>
  );
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
});

export default FavouriteListPage;
