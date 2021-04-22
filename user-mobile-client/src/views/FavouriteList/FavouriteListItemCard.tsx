import React, { FC, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Card, CardItem, Col, Grid, Left, Right, Row, Text } from "native-base";
import {
  ActiveOffer_GetFavouriteList,
  Product_GetFavouriteList,
  ShoppingListItem_GetShoppingListItems,
} from "../../../services/generated";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FavouriteListViewNavigationProp } from "../../navigation_types";
import i18n from "../../../config/i18n";
import AddToShoppingListPopup from "../ProductList/AddToShoppingListPopup";

export interface FavouriteListItemCardProps {
  product: Product_GetFavouriteList;
  navigation: FavouriteListViewNavigationProp;
  addToFavouriteList: Function;
  removeFromFavouriteList: Function;
  addToShoppingList: Function;
  updateShoppingListItem: Function;
  shoppingList: ShoppingListItem_GetShoppingListItems[] | undefined;
}

export interface FavouriteListItemCardState {
  popup: boolean;
}

const FavouriteListItemCard: FC<FavouriteListItemCardProps> = (
  props: FavouriteListItemCardProps
) => {
  let cheapestOffer: ActiveOffer_GetFavouriteList = selectCheapestOffer(
    props.product.activeOffers
  );

  const [popup, setPopup] = useState<FavouriteListItemCardState>({
    popup: false,
  });

  return (
    <Card transparent style={styles.card}>
      <CardItem first>
        <Left style={styles.productTitle}>
          <CardItem button onPress={() => navigateToProductView()}>
            <Text style={styles.productName}>{props.product.name}</Text>
          </CardItem>
        </Left>

        <Right style={styles.closeButton}>
          <CardItem
            button
            onPress={() =>
              props.removeFromFavouriteList({
                variables: { productId: props.product.id },
              })
            }
          >
            <MaterialCommunityIcons name="close" size={28} color="grey" />
          </CardItem>
        </Right>
      </CardItem>
      <CardItem
        last
        style={styles.cardBody}
        button
        onPress={() => navigateToProductView()}
      >
        <Image
          source={{
            uri: props.product.picturePath || "",
          }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <CardItem style={styles.productDesc}>
          <Grid style={styles.productDescGrid}>
            <Col>
              <Row>
                <Text style={styles.productPrice}>
                  {formatPrice(cheapestOffer.price || 0)}
                </Text>
              </Row>
              <Row>
                <Text style={styles.greyText}>
                  "price trend indicator placeholder"
                </Text>
              </Row>
            </Col>
          </Grid>
        </CardItem>
        <CardItem
          button
          onPress={() =>
            setPopup({
              popup: !popup.popup,
            })
          }
        >
          <MaterialIcons name="add-shopping-cart" size={30} color="green" />
        </CardItem>
        <AddToShoppingListPopup
          setState={setPopup}
          state={popup}
          addToShoppingList={props.addToShoppingList}
          updateShoppingList={props.updateShoppingListItem}
          product={props.product}
        />
      </CardItem>
    </Card>
  );
  function navigateToProductView() {
    props.navigation.navigate("ProductView", {
      productId: props.product.id,
    });
  }
};

function formatPrice(price: number): string {
  let formattedPrice = price.toFixed(2);
  return i18n.t("from") + " " + formattedPrice + " Kč";
}

function formatDiscountRate(discountRate: number): string {
  let discountPercentage = (discountRate * 100).toFixed(0);
  return discountPercentage + "%";
}

function selectCheapestOffer(
  offers: ActiveOffer_GetFavouriteList[]
): ActiveOffer_GetFavouriteList {
  let cheapestOffer: ActiveOffer_GetFavouriteList = offers[0];
  offers.forEach((o) => {
    if (cheapestOffer.price > o.price) {
      cheapestOffer = o;
    }
  });
  return cheapestOffer;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    overflow: "hidden",
  },
  cardBody: {
    flexDirection: "row",
  },
  productImage: {
    width: "100%",
    height: "100%",
    flex: 2,
  },
  productDesc: {
    flex: 3,
  },
  productDescGrid: {
    alignSelf: "center",
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  productDiscount: {},
  greyText: {
    color: "grey",
  },
  productTitle: {
    flex: 4,
  },
  closeButton: {
    flex: 1,
  },
});

export default FavouriteListItemCard;
