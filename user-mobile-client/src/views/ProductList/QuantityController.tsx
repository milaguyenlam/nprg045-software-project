import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, CardItem } from "native-base";
import React, { FC, useState } from "react";
import { StyleSheet, Text } from "react-native";
import i18n from "../../../config/i18n";
import {
  ActiveOffer_GetActiveProducts,
  ActiveOffer_GetFavouriteList,
  Product_GetActiveProducts,
  Product_GetFavouriteList,
} from "../../../services/generated";
import { AddToShoppingListPopupState } from "./AddToShoppingListPopup";
import { ProductCardState } from "./ProductCard";

export interface QuantityControllerProps {
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

export interface QuantityControllerState {
  multiplicity: number;
}

const QuantityController: FC<QuantityControllerProps> = (
  props: QuantityControllerProps
) => {
  const [state, setState] = useState<AddToShoppingListPopupState>({
    multiplicity: 0,
  });

  return (
    <CardItem style={styles.buttonContainer}>
      <CardItem style={styles.multiplicityController}>
        <CardItem
          button
          onPress={() => {
            if (state.multiplicity > 0) {
              setState({
                multiplicity: state.multiplicity - 1,
              });
            }
          }}
          style={styles.minusButton}
        >
          <MaterialCommunityIcons name="minus" size={30} />
        </CardItem>
        <Text style={styles.productCount}>{state.multiplicity}x</Text>
        <CardItem
          button
          onPress={() => {
            setState({
              multiplicity: state.multiplicity + 1,
            });
          }}
          style={styles.plusButton}
        >
          <MaterialCommunityIcons name="plus" size={30} />
        </CardItem>
      </CardItem>
      <Button
        style={styles.addButton}
        block
        rounded
        onPress={() => {
          if (props.offer) {
            props.addToShoppingList({
              variables: {
                item: {
                  activeOfferId: props.offer.id,
                  quantity: state.multiplicity,
                },
              },
            });
            props.setState({
              popup: !props.state.popup,
            });
          }
        }}
      >
        <Text style={styles.buttonText}>{i18n.t("add")}</Text>
      </Button>
    </CardItem>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    flex: 1,
    width: "80%",
    elevation: 5,
  },
  card: {
    overflow: "scroll",
    flex: 1,
    borderRadius: 25,
  },

  buttonContainer: {
    flexDirection: "column",
    flex: 1,
  },
  productDesc: {
    flex: 3,
  },

  multiplicityController: {
    justifyContent: "center",
    alignItems: "center",
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
  productPicture: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    flex: 2,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    marginVertical: "5%",
    marginHorizontal: "5%",
  },
  productDescGrid: {},
  offerPrice: {
    fontWeight: "bold",
    fontSize: 20,
  },
  addButton: {
    flex: 1,
    backgroundColor: "green",
    marginHorizontal: "10%",
    marginTop: "5%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default QuantityController;
