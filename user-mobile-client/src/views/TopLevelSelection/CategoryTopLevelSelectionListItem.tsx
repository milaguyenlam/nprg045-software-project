import { ListItem, Left, Text, View } from "native-base";
import React, { FC } from "react";
import {
  FilterType,
  Category_GetSelectionItems,
} from "../../../services/generated";
import { StyleSheet, Image } from "react-native";
import { TopLevelSelectionViewNavigationProp } from "../../navigation_types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultCategoryPicturePath } from "../../shared/ViewConfig";

export interface CategoryTopLevelSelectionItemListProps {
  navigation: TopLevelSelectionViewNavigationProp;
  category: Category_GetSelectionItems;
}

export interface CategoryTopLevelSelectionItemListState {}

export const CategoryTopLevelSelectionItemList: FC<CategoryTopLevelSelectionItemListProps> = (
  props: CategoryTopLevelSelectionItemListProps
) => {
  return (
    <ListItem
      button
      onPress={() => {
        if (props.category.containsProducts) {
          props.navigation.navigate("CategorySelectionView", {
            category: props.category,
          });
        }
      }}
    >
      <Left>
        <MaterialCommunityIcons
          size={15}
          name="lock"
          color={props.category.containsProducts ? "white" : "grey"}
        />
        <View style={styles.thumbnailWrapper}>
          <Image
            style={styles.thumbnail}
            source={{
              uri: props.category.picturePath || defaultCategoryPicturePath,
            }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.text}>{props.category.name}</Text>
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
  disabled: {
    backgroundColor: "#DCDCDC",
  },
});

export default CategoryTopLevelSelectionItemList;
