import { CardItem, Grid, Col, Row } from "native-base";
import React, { FC } from "react";
import { Modal, View, StyleSheet, Image, Text } from "react-native";
import {
  ActiveOffer_GetProduct,
  Product_GetProduct,
} from "../../../services/generated";

export interface ProductDescriptionProps {
  product: Product_GetProduct | undefined | null;
  offer: ActiveOffer_GetProduct | undefined;
}

export interface ProductDescriptionState {}

const ProductDescription: FC<ProductDescriptionProps> = (
  props: ProductDescriptionProps
) => {
  return (
    <>
      <CardItem first>
        <Text style={styles.productName}>{props.product?.name}</Text>
      </CardItem>
      <CardItem last style={styles.cardBody}>
        <View style={styles.productPictureWrapper}>
          <Image
            style={styles.productPicture}
            source={{ uri: props.product?.picturePath || "" }}
            resizeMode="contain"
          />
        </View>
        <CardItem style={styles.productDesc}>
          <Grid>
            <Col>
              <Row>
                <Text style={styles.offerPrice}>
                  {props.offer?.price.toFixed(2) + " Kč"}
                </Text>
              </Row>
              <Row>
                <Text>{props.offer?.store.vendor.name || "no vendor"}</Text>
              </Row>
            </Col>
          </Grid>
        </CardItem>
      </CardItem>
    </>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    flexDirection: "row",
  },
  productDesc: {
    flex: 3,
  },
  productPictureWrapper: {
    flex: 5,
  },
  productPicture: {
    width: "100%",
    height: "100%",
  },
  offerPrice: {
    fontWeight: "bold",
    fontSize: 20,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    margin: "5%",
  },
});

export default ProductDescription;
