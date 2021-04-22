import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Body,
  Button,
  Header,
  Left,
  Right,
  Subtitle,
  Title,
} from "native-base";
import {
  ProductListViewNavigationProp,
  ProductListViewRouteProp,
  TopLevelSelectionViewNavigationProp,
} from "../../navigation_types";
import i18n from "../../../config/i18n";
import { FilterType } from "../../../services/generated";

export interface TopBarProps {
  navigation: ProductListViewNavigationProp;
  route: ProductListViewRouteProp;
}

export interface TopBarState {}

const TopBar: FC<TopBarProps> = (props: TopBarProps) => {
  return (
    <Header style={styles.header}>
      <Left>
        <Button
          style={styles.button}
          transparent
          onPress={() => props.navigation.navigate("SearchView")}
        >
          <Ionicons name="md-search" size={30} color="white" />
        </Button>
      </Left>
      <Body>
        <Title style={styles.title}>{i18n.t("productListings")}</Title>
        <Subtitle style={styles.subtitle}>{writeTitle(props.route)}</Subtitle>
      </Body>
      <Right>
        <Button
          style={styles.button}
          transparent
          onPress={() => props.navigation.navigate("TopLevelSelectionView")}
        >
          <MaterialCommunityIcons name="filter" size={30} color="white" />
        </Button>
      </Right>
    </Header>
  );
};

function writeTitle(props: ProductListViewRouteProp): string {
  if (props.params.selectedFilterType != FilterType.All) {
    return props.params.selectedEntityName;
  } else {
    return i18n.t("allProducts");
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "green",
  },
  title: {
    color: "white",
  },
  subtitle: {
    color: "white",
  },
  button: {},
});

export default TopBar;
