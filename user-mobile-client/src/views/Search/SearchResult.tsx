import { ListItem, Text } from "native-base";
import React, { FC } from "react";
import {
  Category_GetSearchResult,
  FilterType,
  Product_GetSearchResult,
  Vendor_GetSearchResult,
} from "../../../services/generated";
import { StyleSheet, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation_types";

export interface SearchResultProps {
  product?: Product_GetSearchResult | undefined;
  vendor?: Vendor_GetSearchResult | undefined;
  category?: Category_GetSearchResult | undefined;
  navigation: StackNavigationProp<RootStackParamList>;
  index: number;
}

export interface SearchResultState {}

const SearchResult: FC<SearchResultProps> = (props: SearchResultProps) => {
  return (
    <ListItem
      key={props.index}
      button
      onPress={() => {
        if (props.category) {
          categoryNavigate();
        } else if (props.vendor) {
          vendorNavigate();
        } else if (props.product) {
          productNavigate();
        } else {
          console.error(
            "Fetching was not successful! The type for SearchResult (Vendor, Category or Product) was not specified!"
          );
        }
      }}
    >
      {renderContent()}
    </ListItem>
  );

  function renderContent() {
    let pictureUri;
    let name;
    if (props.category) {
      pictureUri = props.category.picturePath;
      name = props.category.name;
    } else if (props.vendor) {
      pictureUri = props.vendor.thumbnailPath;
      name = props.vendor.name;
    } else if (props.product) {
      pictureUri = props.product.picturePath;
      name = props.product.name;
    } else {
      console.error(
        "Fetching was not successful! The type for SearchResult (Vendor, Category or Product) was not specified!"
      );
    }
    return (
      <>
        <Image
          style={styles.image}
          source={{ uri: pictureUri || "" }}
          resizeMode="contain"
        />
        <Text>{name}</Text>
      </>
    );
  }

  function categoryNavigate() {
    if (props.category) {
      props.navigation.navigate("ProductListView", {
        selectedVendorId: null,
        selectedEntityName: props.category.name,
        selectedFilterType: FilterType.Category,
        selectedCategoryIds: props.category.parentId
          ? [props.category.id, props.category.parentId]
          : [props.category.id],
      });
    }
  }

  function vendorNavigate() {
    if (props.vendor) {
      props.navigation.navigate("ProductListView", {
        selectedVendorId: props.vendor.id,
        selectedFilterType: FilterType.Vendor,
        selectedEntityName: props.vendor.name,
        selectedCategoryIds: null,
      });
    }
  }

  function productNavigate() {
    if (props.product) {
      props.navigation.navigate("ProductView", {
        productId: props.product?.id,
      });
    }
  }
};

const styles = StyleSheet.create({
  searchContainer: {},
  loadingSpinner: {},
  image: {
    marginRight: 15,
    width: 40,
    height: 40,
  },
});

export default SearchResult;
