import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Col, Grid, ListItem, Row, Text } from "native-base";
import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";
import { Product_GetProduct } from "../../../services/generated";
import { ProductViewRouteProp } from "../../navigation_types";

export interface ProductListItemProps {
  product: Product_GetProduct | undefined | null;
  addToFavouriteList: Function;
  removeFromFavouriteList: Function;
  isInFavouriteList: Function;
}

export interface ProductListItemState {}

export const ProductListItem: FC<ProductListItemProps> = (
  props: ProductListItemProps
) => {
  return (
    <ListItem style={styles.productItem}>
      <Image
        style={styles.productPicture}
        source={{ uri: props.product?.picturePath || "" }}
        resizeMode="contain"
      />
      <Grid style={styles.producDescGrid}>
        <Col>
          <Row>
            <Text style={styles.productName}>{props.product?.name}</Text>
          </Row>
          <Row>
            <Text style={styles.productDescription}>
              {props.product?.description}
            </Text>
          </Row>
        </Col>
      </Grid>
      <Button
        transparent
        style={styles.button}
        onPress={() => {
          if (props.product) {
            if (!props.isInFavouriteList(props.product) || false) {
              props.addToFavouriteList({
                variables: { productId: props.product.id },
              });
            } else {
              props.removeFromFavouriteList({
                variables: { productId: props.product.id },
              });
            }
          }
        }}
      >
        <MaterialCommunityIcons
          name={
            props.isInFavouriteList(props.product) ? "heart" : "heart-outline"
          }
          size={30}
          color="green"
        />
      </Button>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  producDescGrid: {
    flex: 7,
    paddingHorizontal: 15,
  },
  button: {
    alignSelf: "center",
    flex: 2,
  },
  productItem: {
    flexDirection: "row",
  },
  productPicture: {
    width: 100,
    height: 100,
    alignSelf: "center",
    flex: 4,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 17,
  },
  productDescription: {
    color: "grey",
    fontSize: 13,
  },
});

export default ProductListItem;
