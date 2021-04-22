import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Card, CardItem, Col, Grid, Row } from "native-base";
import React, { FC, useState } from "react";
import { Modal, View, StyleSheet, Image, Text } from "react-native";
import i18n from "../../../config/i18n";
import {
  ActiveOffer_GetProduct,
  Product_GetProduct,
} from "../../../services/generated";
import { OfferListItemState } from "./OfferListItem";
import ProductDescription from "./ProductDescription";
import QuantityController from "./QuantityController";

export interface AddToShoppingListPopupProps {
  setState: React.Dispatch<React.SetStateAction<OfferListItemState>>;
  state: OfferListItemState;
  addToShoppingList: Function;
  updateShoppingList: Function;
  product: Product_GetProduct | undefined | null;
  offer: ActiveOffer_GetProduct | undefined;
}

export interface AddToShoppingListPopupState {
  multiplicity: number;
}

const AddToShoppingListPopup: FC<AddToShoppingListPopupProps> = (
  props: AddToShoppingListPopupProps
) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent
        visible={props.state.popup}
        onRequestClose={() => {
          props.setState({
            popup: !props.state.popup,
          });
        }}
      >
        <View style={styles.centeredView}>
          <Card style={styles.card}>
            <ProductDescription product={props.product} offer={props.offer} />
            <QuantityController
              setState={props.setState}
              state={props.state}
              offer={props.offer}
              addToShoppingList={props.addToShoppingList}
            />
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    marginVertical: "60%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    overflow: "scroll",
    flex: 1,
    borderRadius: 20,
  },
});

export default AddToShoppingListPopup;
