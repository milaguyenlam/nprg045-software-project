import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Body, Button, Header, Left, Right, Title } from "native-base";
import {
  FavouriteListViewNavigationProp,
  ProductListViewNavigationProp,
  ShoppingListViewNavigationProp,
} from "../../navigation_types";

export interface TopBarProps {
  navigation:
    | ProductListViewNavigationProp
    | FavouriteListViewNavigationProp
    | ShoppingListViewNavigationProp;
  productName: string | undefined;
}

export interface TopBarState {}

const TopBar: FC<TopBarProps> = (props: TopBarProps) => {
  return (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => props.navigation.goBack()}>
          <Ionicons name="md-arrow-back" size={24} color="white" />
        </Button>
      </Left>
      <Body>
        <Title style={styles.title}>{props.productName}</Title>
      </Body>
      <Right></Right>
    </Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "green",
  },
  title: {
    color: "white",
  },
});

export default TopBar;
