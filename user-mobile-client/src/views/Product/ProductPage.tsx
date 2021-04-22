import { ApolloError } from "@apollo/client";
import { Content, List, ListItem, Text } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../config/i18n";
import {
  ActiveOffer_GetActiveProducts,
  FavouriteListItem_GetFavouriteList,
  Product_GetActiveProducts,
  Product_GetProduct,
  ShoppingListItem_GetShoppingListItems,
} from "../../../services/generated";
import {
  FavouriteListViewNavigationProp,
  ProductListViewNavigationProp,
  ShoppingListViewNavigationProp,
} from "../../navigation_types";
import SplashScreenView from "../SplashScreen/SplashScreenView";
import OfferListItem from "./OfferListItem";
import ProductListItem from "./ProductListItem";
import ErrorPage from "../../shared/ErrorPage";

export interface ProductPageProps {
  product: Product_GetProduct | null | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  navigation:
    | ProductListViewNavigationProp
    | FavouriteListViewNavigationProp
    | ShoppingListViewNavigationProp;
  addToShoppingList: Function;
  removeFromShoppingList: Function;
  updateShoppingListItem: Function;
  addToFavouriteList: Function;
  removeFromFavouriteList: Function;
  favouriteList: FavouriteListItem_GetFavouriteList[] | undefined;
  shoppingList: ShoppingListItem_GetShoppingListItems[] | undefined;
}

export interface ProductPageState {}

const ProductPage: FC<ProductPageProps> = (props: ProductPageProps) => {
  if (props.loading) {
    return <SplashScreenView />;
  }
  if (props.error) {
    return <ErrorPage error={props.error} navigation={props.navigation} />;
  }
  return (
    <Content>
      <List>
        <ProductListItem
          product={props.product}
          addToFavouriteList={props.addToFavouriteList}
          removeFromFavouriteList={props.removeFromFavouriteList}
          isInFavouriteList={isInFavouriteList}
        />

        <ListItem itemDivider>
          <Text>{i18n.t("currentProductOffers")}</Text>
        </ListItem>
        {props.product?.activeOffers.map((offer, index) => (
          <OfferListItem
            product={props.product}
            offer={offer}
            key={index}
            addToShoppingList={props.addToShoppingList}
            removeFromShoppingList={props.removeFromShoppingList}
            updateShoppingListItem={props.updateShoppingListItem}
            isInShoppingList={isInShoppingList}
          />
        ))}
      </List>
    </Content>
  );

  function isInFavouriteList(product: Product_GetActiveProducts): boolean {
    const idList = props.favouriteList?.map((fav) => fav.product.id);
    return idList?.includes(product.id) || false;
  }

  function isInShoppingList(offer: ActiveOffer_GetActiveProducts) {
    const idList = props.shoppingList?.map((sLitem) => sLitem.activeOffer.id);
    return idList?.includes(offer.id);
  }
};

const styles = StyleSheet.create({});

export default ProductPage;
