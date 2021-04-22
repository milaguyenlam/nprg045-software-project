import { Col, Grid, ListItem, Row, Text } from "native-base";
import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";
import {
  ActiveOffer_GetActiveProducts,
  ActiveOffer_GetFavouriteList,
  Product_GetActiveProducts,
  Product_GetFavouriteList,
} from "../../../services/generated";
import { ProductCardState } from "./ProductCard";
import QuantityController from "./QuantityController";

export interface OfferListItemProps {
  setState: React.Dispatch<React.SetStateAction<ProductCardState>>;
  state: ProductCardState;
  addToShoppingList: Function;
  updateShoppingList: Function;
  offer:
    | ActiveOffer_GetActiveProducts
    | ActiveOffer_GetFavouriteList
    | undefined;
  product: Product_GetActiveProducts | Product_GetFavouriteList;
}

export interface OfferListItemState {
  popup: any;
  multiplicity: number;
}

const OfferListItem: FC<OfferListItemProps> = (props: OfferListItemProps) => {
  return (
    <ListItem>
      <Image
        style={styles.vendorThumbnail}
        source={{ uri: props.offer?.store.vendor.thumbnailPath || "" }}
        resizeMode="center"
      />
      <Grid style={styles.offerDescGrid}>
        <Col>
          <Row>
            <Text style={styles.offerPrice}>
              {props.offer?.price.toFixed(2) + " Kč"}
            </Text>
            <Text style={styles.discountRate}>
              -{props.offer?.discountRate}%
            </Text>
          </Row>
          <Row>
            <Text style={styles.toDate}>{props.offer?.toDate}</Text>
          </Row>
          <Row>
            <Text style={styles.offerDescription}>
              {props.offer?.description}
            </Text>
          </Row>
          <QuantityController
            setState={props.setState}
            state={props.state}
            addToShoppingList={props.addToShoppingList}
            updateShoppingList={props.updateShoppingList}
            offer={props.offer}
            product={props.product}
          />
        </Col>
      </Grid>
    </ListItem>
  );
};

//TODO: scale vendor thumbnails
const styles = StyleSheet.create({
  vendorThumbnail: {
    width: 75,
    height: 75,
    alignSelf: "center",
    flex: 3,
  },
  offerDescGrid: {
    flex: 8,
    paddingHorizontal: 15,
  },
  button: {
    alignSelf: "center",
    flex: 2,
  },
  offerItem: {
    flexDirection: "row",
  },
  offerPrice: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 20,
  },
  offerDescription: {
    color: "grey",
  },
  discountRate: {
    flex: 1,
    color: "green",
    fontWeight: "bold",
  },
  toDate: {
    fontWeight: "500",
  },
});

export default OfferListItem;
