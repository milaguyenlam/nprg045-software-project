import { Content, List, ListItem } from "native-base";
import React, { FC } from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import i18n from "../../../config/i18n";
import {
  ActiveOffer_GetActiveProducts,
  ActiveOffer_GetFavouriteList,
  Product_GetActiveProducts,
  Product_GetFavouriteList,
} from "../../../services/generated";
import OfferListItem from "./OfferListItem";
import { ProductCardState } from "./ProductCard";
import ProductListItem from "./ProductListItem";

export interface AddToShoppingListPopupProps {
  setState: React.Dispatch<React.SetStateAction<ProductCardState>>;
  state: ProductCardState;
  addToShoppingList: Function;
  updateShoppingList: Function;
  product: Product_GetActiveProducts | Product_GetFavouriteList;
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
        transparent
        animationType="slide"
        visible={props.state.popup}
        onRequestClose={() => {
          props.setState({
            popup: !props.state.popup,
          });
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Content>
              <List>
                <ProductListItem product={props.product} />
                <ListItem itemDivider>
                  <Text>{i18n.t("currentProductOffers")}</Text>
                </ListItem>
                {props.product.activeOffers.map(
                  (
                    offer:
                      | ActiveOffer_GetActiveProducts
                      | ActiveOffer_GetFavouriteList
                      | undefined,
                    index: React.Key | null | undefined
                  ) => (
                    <OfferListItem
                      setState={props.setState}
                      state={props.state}
                      addToShoppingList={props.addToShoppingList}
                      updateShoppingList={props.updateShoppingList}
                      offer={offer}
                      key={index}
                      product={props.product}
                    />
                  )
                )}
              </List>
            </Content>
          </View>
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
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    flex: 2,
    width: "80%",
    elevation: 5,
  },
});

export default AddToShoppingListPopup;
