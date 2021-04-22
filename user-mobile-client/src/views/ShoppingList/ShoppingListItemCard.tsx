import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";
import { Card, CardItem, Text, View } from "native-base";
import { ShoppingListItem_GetShoppingListItems } from "../../../services/generated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ShoppingListViewNavigationProp } from "../../navigation_types";
export interface ShoppingListItemCardProps {
  shoppingListItem: ShoppingListItem_GetShoppingListItems;
  addToShoppingList: Function;
  removeFromShoppingList: Function;
  updateShoppingListItem: Function;
  navigation: ShoppingListViewNavigationProp;
}

export interface ShoppingListItemCardState {}

const ShoppingListItemCard: FC<ShoppingListItemCardProps> = (
  props: ShoppingListItemCardProps
) => {
  return (
    <Card style={styles.card}>
      <CardItem
        style={styles.productImage}
        button
        onPress={() => navigateToProductView()}
      >
        <Image
          source={{
            uri: props.shoppingListItem.activeOffer.product.picturePath || "",
          }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </CardItem>
      <CardItem style={styles.cardBody}>
        <CardItem
          button
          style={styles.closeButton}
          onPress={() => {
            props.removeFromShoppingList({
              variables: {
                itemId: props.shoppingListItem.id,
              },
            });
          }}
        >
          <View style={styles.leftSpaceCloseButton}></View>
          <MaterialCommunityIcons name="close" size={28} color="grey" />
        </CardItem>
        <CardItem>
          <Text style={styles.productName}>
            {props.shoppingListItem.activeOffer.product.name}
          </Text>
        </CardItem>
        <CardItem>
          <Text style={styles.productPrice}>
            {formatPrice(props.shoppingListItem.activeOffer.price)}
          </Text>
        </CardItem>
        <CardItem style={styles.multiplicityController}>
          <CardItem
            button
            onPress={() => {
              if (props.shoppingListItem.quantity > 1) {
                props.updateShoppingListItem({
                  variables: {
                    item: {
                      id: props.shoppingListItem.id,
                      quantity: props.shoppingListItem.quantity - 1,
                    },
                  },
                });
              }
            }}
            style={styles.minusButton}
          >
            <MaterialCommunityIcons name="minus" size={30} />
          </CardItem>
          <Text style={styles.productCount}>
            {props.shoppingListItem.quantity}
          </Text>
          <CardItem
            button
            onPress={() => {
              props.updateShoppingListItem({
                variables: {
                  item: {
                    id: props.shoppingListItem.id,
                    quantity: props.shoppingListItem.quantity + 1,
                  },
                },
              });
            }}
            style={styles.plusButton}
          >
            <MaterialCommunityIcons name="plus" size={30} />
          </CardItem>
        </CardItem>
      </CardItem>
    </Card>
  );
  function navigateToProductView() {
    props.navigation.navigate("ProductView", {
      productId: props.shoppingListItem.activeOffer.product.id,
    });
  }
};

function formatPrice(price: number): string {
  let formattedPrice = price.toFixed(2);
  return formattedPrice + " Kč";
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    overflow: "hidden",
    flexDirection: "row",
  },
  productImage: {
    width: "100%",
    height: "100%",
    flex: 2,
  },
  cardBody: {
    alignItems: "center",
    alignContent: "center",
    flex: 3,
    flexDirection: "column",
  },
  cardHeader: {},
  blackBox: {
    backgroundColor: "black",
    height: 100,
    width: 100,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
  },
  closeButton: {
    flex: 1,
  },
  leftSpaceCloseButton: {
    flex: 100,
  },
  plusButton: {
    flex: 1,
  },
  minusButton: {
    flex: 1,
  },
  productCount: {
    flex: 1,
  },
  multiplicityController: {},
});

export default ShoppingListItemCard;
