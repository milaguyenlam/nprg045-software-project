import { StackNavigationProp } from "@react-navigation/stack";
import { Container } from "native-base";
import React, { FC } from "react";
import { useGetSubCategories } from "../../../services/generated";
import CategoryList from "./CategoryList";
import TopBar from "./TopBar";
import {
  CategorySelectionViewRouteProp,
  RootStackParamList,
  TopLevelSelectionViewNavigationProp,
} from "../../navigation_types";

export interface CategorySelectionViewProps {
  navigation: TopLevelSelectionViewNavigationProp;
  route: CategorySelectionViewRouteProp;
}

export interface CategorySelectionViewState {}

const CategorySelectionView: FC<CategorySelectionViewProps> = (
  props: CategorySelectionViewProps
) => {
  const { loading, error, data } = useGetSubCategories({
    variables: {
      categoryId: props.route.params.category.id,
    },
  });

  return (
    <Container>
      <TopBar navigation={props.navigation} route={props.route} />
      <CategoryList
        navigation={props.navigation}
        loading={loading}
        error={error}
        parentCategory={props.route.params.category}
        categories={data?.subCategories}
      />
    </Container>
  );
};

export default CategorySelectionView;
