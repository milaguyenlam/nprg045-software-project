import { ListItem, View, Text, Left } from "native-base";
import React, { FC } from "react";
import {
  Category_GetSelectionItems,
  Category_GetSubCategories,
  FilterType,
} from "../../../services/generated";
import { StyleSheet, Image } from "react-native";
import { TopLevelSelectionViewNavigationProp } from "../../navigation_types";
import i18n from "../../../config/i18n";
import { defaultCategoryPicturePath } from "../../shared/ViewConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface CategoryCardProps {
  category: Category_GetSubCategories;
  navigation: TopLevelSelectionViewNavigationProp;
  parentCategory: Category_GetSelectionItems;
}

export interface CategoryCardState {}

const CategoryCard: FC<CategoryCardProps> = (props: CategoryCardProps) => {
  return (
    <ListItem
      button
      onPress={() => {
        if (props.category.containsProducts) {
          props.navigation.navigate("ProductListView", {
            selectedCategoryIds: [props.category.id, props.parentCategory.id],
            selectedVendorId: null,
            selectedFilterType: FilterType.Category,
            selectedEntityName: props.category.name,
          });
        }
      }}
      style={styles.card}
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
        <Text style={styles.categoryName}>{props.category.name}</Text>
      </Left>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
  },
  thumbnail: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  thumbnailWrapper: {
    flex: 2,
  },
  categoryName: {
    flex: 7,
  },
  productCount: {
    flex: 1,
    fontSize: 9,
  },
});

export default CategoryCard;
