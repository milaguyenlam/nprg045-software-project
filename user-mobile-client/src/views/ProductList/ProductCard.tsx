import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Button, Card, CardItem, Col, Grid, Row, Text } from "native-base";
import {
  ActiveOffer_GetActiveProducts,
  Product_GetActiveProducts,
} from "../../../services/generated";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ProductListViewNavigationProp } from "../../navigation_types";
import i18n from "../../../config/i18n";
import AddToShoppingListPopup from "./AddToShoppingListPopup";

export interface ProductCardProps {
  product: Product_GetActiveProducts;
  navigation: ProductListViewNavigationProp;
  addToFavouriteList: Function;
  removeFromFavouriteList: Function;
  inFavouriteList: Function;
  addToShoppingList: Function;
  updateShoppingListItem: Function;
}

export interface ProductCardState {
  popup: boolean;
}

const ProductCard: FC<ProductCardProps> = (props: ProductCardProps) => {
  let cheapestOffer: ActiveOffer_GetActiveProducts = selectCheapestOffer(
    props.product.activeOffers
  );

  const [popup, setPopup] = useState<ProductCardState>({
    popup: false,
  });

  return (
    <Card transparent style={styles.card}>
      <CardItem
        first
        button
        onPress={() =>
          props.navigation.navigate("ProductView", {
            productId: props.product.id,
          })
        }
      >
        <Text style={styles.productName}>{props.product.name}</Text>
      </CardItem>
      <CardItem
        last
        style={styles.cardBody}
        button
        onPress={() =>
          props.navigation.navigate("ProductView", {
            productId: props.product.id,
          })
        }
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
                <Text style={styles.productStore}>
                  {cheapestOffer.store.vendor.name}
                </Text>
              </Row>
            </Col>
          </Grid>
        </CardItem>
        <CardItem style={styles.buttonContainer}>
          <Button
            transparent
            style={styles.heartButton}
            onPress={() => {
              if (props.inFavouriteList(props.product)) {
                props.removeFromFavouriteList({
                  variables: {
                    productId: props.product.id,
                  },
                });
              } else {
                props.addToFavouriteList({
                  variables: {
                    productId: props.product.id,
                  },
                });
              }
            }}
          >
            <MaterialCommunityIcons
              name={
                props.inFavouriteList(props.product) ? "heart" : "heart-outline"
              }
              size={30}
              color="green"
            />
          </Button>
          <Button
            transparent
            style={styles.button}
            onPress={() =>
              setPopup({
                popup: !popup.popup,
              })
            }
          >
            <MaterialIcons name="add-shopping-cart" size={30} color="green" />
          </Button>
          <AddToShoppingListPopup
            setState={setPopup}
            state={popup}
            addToShoppingList={props.addToShoppingList}
            updateShoppingList={props.updateShoppingListItem}
            product={props.product}
          />
        </CardItem>
      </CardItem>
    </Card>
  );
};

function formatPrice(price: number): string {
  let formattedPrice = price.toFixed(2);
  return i18n.t("from") + " " + formattedPrice + " Kč";
}

function selectCheapestOffer(
  offers: ActiveOffer_GetActiveProducts[]
): ActiveOffer_GetActiveProducts {
  let cheapestOffer: ActiveOffer_GetActiveProducts = offers[0];
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
  buttonContainer: {
    flexDirection: "column",
  },
  button: {
    alignSelf: "center",
  },
  heartButton: {
    alignContent: "center",
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
  productStore: {
    color: "grey",
  },
});

export default ProductCard;
