import { ApolloError } from "@apollo/client";
import { Content } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { ShoppingListViewNavigationProp } from "../../navigation_types";
import SplashScreenView from "../SplashScreen/SplashScreenView";
import ShoppingListItemCard from "./ShoppingListItemCard";
import ErrorPage from "../../shared/ErrorPage";
import { ShoppingListItem_GetShoppingListItems } from "../../../services/generated";
import { contentBackgroundColor } from "../../shared/ViewConfig";

export interface ShoppingListPageProps {
  error: ApolloError | undefined;
  loading: boolean;
  shoppingListItems: ShoppingListItem_GetShoppingListItems[] | undefined;
  refetch: Function;
  navigation: ShoppingListViewNavigationProp;
  addToShoppingList: Function;
  removeFromShoppingList: Function;
  updateShoppingListItem: Function;
}

export interface ShoppingListPageState {}

const ShoppingListPage: FC<ShoppingListPageProps> = (
  props: ShoppingListPageProps
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
      {props.shoppingListItems?.map((sli, index) => (
        //TODO: group by vendors
        <ShoppingListItemCard
          navigation={props.navigation}
          key={index}
          shoppingListItem={sli}
          addToShoppingList={props.addToShoppingList}
          removeFromShoppingList={props.removeFromShoppingList}
          updateShoppingListItem={props.updateShoppingListItem}
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

export default ShoppingListPage;
