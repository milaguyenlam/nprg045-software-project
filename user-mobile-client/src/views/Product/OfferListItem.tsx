import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Col, Grid, ListItem, Row, Text } from "native-base";
import React, { FC, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { State } from "react-native-gesture-handler";
import i18n from "../../../config/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActiveOffer_GetProduct,
  Product_GetProduct,
} from "../../../services/generated";
import AddToShoppingListPopup from "./AddToShoppingListPopup";

export interface OfferListItemProps {
  product: Product_GetProduct | undefined | null;
  offer: ActiveOffer_GetProduct | undefined;
  addToShoppingList: Function;
  removeFromShoppingList: Function;
  updateShoppingListItem: Function;
  isInShoppingList: Function;
}

export interface OfferListItemState {
  popup: boolean;
}

export const OfferListItem: FC<OfferListItemProps> = (
  props: OfferListItemProps
) => {
  const [state, setState] = useState<OfferListItemState>({
    popup: false,
  });

  return (
    <ListItem style={styles.offerItem}>
      <Image
        style={styles.vendorThumbnail}
        source={{ uri: props.offer?.store.vendor.thumbnailPath || "" }}
        resizeMode="center"
      />
      <Grid style={styles.offerDescGrid}>
        <Row>
          <Text style={styles.offerPrice}>
            {props.offer?.price.toFixed(2) + " Kč"}
          </Text>
          <Text> </Text>
          <Text style={styles.discountRate}>
            {formatDiscountRate(props.offer?.discountRate || 0)}
          </Text>
        </Row>
        <Row>
          <Text style={styles.toDate}>
            {i18n.t("to") + " " + props.offer?.toDate.split(" ")[0]}
          </Text>
        </Row>
        <Row>
          <Text style={styles.offerDescription}>
            {props.offer?.description}
          </Text>
        </Row>
      </Grid>
      <Button
        transparent
        style={styles.button}
        onPress={() =>
          setState({
            popup: !state.popup,
          })
        }
      >
        <MaterialIcons
          name={
            props.isInShoppingList(props.offer)
              ? "remove-shopping-cart"
              : "add-shopping-cart"
          }
          size={30}
          color={props.isInShoppingList(props.offer) ? "red" : "green"}
        />
      </Button>
      <AddToShoppingListPopup
        setState={setState}
        state={state}
        addToShoppingList={props.addToShoppingList}
        updateShoppingList={props.removeFromShoppingList}
        product={props.product}
        offer={props.offer}
      />
    </ListItem>
  );
  function formatDiscountRate(rate: number): string {
    let percentage = rate * 100;
    if (percentage > 0) {
      return "-" + percentage.toFixed(0) + "%";
    }
    return "";
  }
};

const styles = StyleSheet.create({
  offerDescGrid: {
    flex: 8,
    paddingHorizontal: 15,
  },
  button: {
    alignSelf: "center",
    flex: 2,
  },
  vendorThumbnail: {
    width: 75,
    height: 75,
    alignSelf: "center",
    flex: 3,
  },
  offerItem: {
    flexDirection: "row",
  },
  offerPrice: {
    fontWeight: "bold",
    fontSize: 20,
  },
  offerDescription: {
    color: "grey",
  },
  discountRate: {
    color: "green",
    fontWeight: "bold",
  },
  toDate: {
    fontWeight: "500",
  },
});

export default OfferListItem;
