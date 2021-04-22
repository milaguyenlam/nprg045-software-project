import { Container } from "native-base";
import React, { FC } from "react";
import { useGetSelectionItems } from "../../../services/generated";
import TopLevelSelectionList from "./TopLevelSelectionList";
import NavigationBar from "./NavigationBar";
import TopBar from "./TopBar";
import {
  TopLevelSelectionViewRouteProp,
  TopLevelSelectionViewNavigationProp,
} from "../../navigation_types";

export interface TopLevelSelectionViewProps {
  navigation: TopLevelSelectionViewNavigationProp;
  route: TopLevelSelectionViewRouteProp;
}

export interface TopLevelSelectionViewState {}

const TopLevelSelectionView: FC<TopLevelSelectionViewProps> = (
  props: TopLevelSelectionViewProps
) => {
  const { loading, error, data } = useGetSelectionItems();

  return (
    <Container>
      <TopBar navigation={props.navigation} />
      <TopLevelSelectionList
        navigation={props.navigation}
        loading={loading}
        error={error}
        topLevelCategories={data?.topLevelCategories}
        vendors={data?.vendors}
      />
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

export default TopLevelSelectionView;
