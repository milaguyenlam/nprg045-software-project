import { ApolloError } from "@apollo/client";
import { Content, Left, List, ListItem, Text, View } from "native-base";
import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";
import i18n from "../../../config/i18n";
import {
  Category_GetSelectionItems,
  Category_GetSubCategories,
  FilterType,
} from "../../../services/generated";
import { TopLevelSelectionViewNavigationProp } from "../../navigation_types";
import SplashScreenView from "../SplashScreen/SplashScreenView";
import ErrorPage from "../../shared/ErrorPage";
import { defaultCategoryPicturePath } from "../../shared/ViewConfig";
import CategoryCard from "./CategoryCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export interface CategoryListProps {
  navigation: TopLevelSelectionViewNavigationProp;
  loading: boolean;
  error: ApolloError | undefined;
  categories: Category_GetSubCategories[] | undefined;
  parentCategory: Category_GetSelectionItems;
}

export interface CategoryListState {}

const CategoryList: FC<CategoryListProps> = (props: CategoryListProps) => {
  if (props.loading) {
    return <SplashScreenView />;
  }
  if (props.error) {
    return <ErrorPage navigation={props.navigation} error={props.error} />;
  }
  return (
    <Content>
      <List>
        <ListItem
          button
          onPress={() => {
            props.navigation.navigate("ProductListView", {
              selectedCategoryIds: [props.parentCategory.id],
              selectedVendorId: null,
              selectedFilterType: FilterType.Category,
              selectedEntityName: props.parentCategory.name,
            });
          }}
        >
          {/* TODO: take picture of corresponding top level category */}

          <Left style={styles.firstRow}>
            <MaterialCommunityIcons size={15} name="lock" color={"white"} />
            <View style={styles.thumbnailWrapper}>
              <Image
                style={styles.thumbnail}
                source={{
                  uri: defaultCategoryPicturePath,
                }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.categoryName}>{i18n.t("all")}</Text>
          </Left>
        </ListItem>
        {props.categories?.map((category, index) => {
          return (
            <CategoryCard
              key={index}
              category={category}
              navigation={props.navigation}
              parentCategory={props.parentCategory}
            />
          );
        })}
      </List>
    </Content>
  );
};

const styles = StyleSheet.create({
  disabledCard: {
    flexDirection: "column",
  },
  card: {
    flexDirection: "column",
  },
  firstRow: {
    flexDirection: "row",
  },
  nameAndThumbnail: {
    flexDirection: "row",
  },
  container: {
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

export default CategoryList;
