import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Footer, FooterTab, Button, Text } from "native-base";
import { StyleSheet } from "react-native";
import React, { FC } from "react";
import i18n from "../../../config/i18n";
import {
  FavouriteListViewNavigationProp,
  ProductListViewDefaultVariables,
} from "../../navigation_types";

export interface NavigationBarProps {
  navigation: FavouriteListViewNavigationProp;
}

export interface NavigationBarState {}

export const NavigationBar: FC<NavigationBarProps> = (
  props: NavigationBarProps
) => {
  return (
    <Footer>
      <FooterTab style={styles.theme}>
        <Button
          onPress={() =>
            props.navigation.navigate(
              "ProductListView",
              ProductListViewDefaultVariables
            )
          }
        >
          <MaterialCommunityIcons name="sale" size={24} color="gray" />
          <Text style={styles.text}>{i18n.t("sale")}</Text>
        </Button>
        {/* <Button onPress={() => {}}>
          <MaterialIcons name="store" size={24} color="gray" />
          <Text style={styles.text}>{i18n.t("stores")}</Text>
        </Button> */}
        <Button onPress={() => props.navigation.navigate("ShoppingListView")}>
          <MaterialIcons name="shopping-cart" size={24} color="gray" />
          <Text style={styles.text}>{i18n.t("cart")}</Text>
        </Button>
        <Button onPress={() => props.navigation.navigate("FavouriteListView")}>
          <MaterialCommunityIcons name="heart" size={24} color="green" />
          <Text style={styles.selected}>{i18n.t("favourite")}</Text>
        </Button>
        {/* <Button onPress={() => props.navigation.navigate("SettingsView")}>
          <MaterialIcons name="settings" size={24} color="gray" />
          <Text style={styles.text}>{i18n.t("settings")}</Text>
        </Button> */}
      </FooterTab>
    </Footer>
  );
};

const styles = StyleSheet.create({
  theme: {
    backgroundColor: "white",
  },
  text: {
    color: "gray",
    fontSize: 9,
  },
  selected: {
    color: "green",
    fontSize: 9,
  },
});

export default NavigationBar;
