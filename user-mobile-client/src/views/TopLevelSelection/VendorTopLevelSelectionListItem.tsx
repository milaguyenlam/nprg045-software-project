import { ListItem, Left, Text, View } from "native-base";
import React, { FC } from "react";
import {
  FilterType,
  Vendor_GetSelectionItems,
} from "../../../services/generated";
import { StyleSheet, Image } from "react-native";
import {
  ProductListViewDefaultVariables,
  TopLevelSelectionViewNavigationProp,
} from "../../navigation_types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultCategoryPicturePath } from "../../shared/ViewConfig";

export interface TopLevelSelectionItemListProps {
  navigation: TopLevelSelectionViewNavigationProp;
  vendor: Vendor_GetSelectionItems;
}

export interface TopLevelSelectionItemListState {}

export const TopLevelSelectionItemList: FC<TopLevelSelectionItemListProps> = (
  props: TopLevelSelectionItemListProps
) => {
  return (
    <ListItem
      button
      onPress={() => {
        if (props.vendor.containsProducts) {
          props.navigation.navigate(
            "ProductListView",
            ProductListViewDefaultVariables
          );
        }
      }}
    >
      <Left>
        <MaterialCommunityIcons
          size={15}
          name="lock"
          color={props.vendor.containsProducts ? "white" : "grey"}
        />
        <View style={styles.thumbnailWrapper}>
          <Image
            style={styles.thumbnail}
            source={{
              uri: props.vendor.thumbnailPath || defaultCategoryPicturePath,
            }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.text}>{props.vendor.name}</Text>
      </Left>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    flex: 1,
    height: "100%",
    width: "100%",
    marginRight: "4%",
  },
  thumbnailWrapper: {
    flex: 1,
  },
  text: {
    flex: 4,
  },
  productCount: {
    flex: 1,
    fontSize: 9,
    color: "grey",
  },
});

export default TopLevelSelectionItemList;
