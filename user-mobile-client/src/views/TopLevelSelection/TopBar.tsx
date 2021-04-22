import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Body, Button, Header, Left, Title, Right } from "native-base";
import { TopLevelSelectionViewNavigationProp } from "../../navigation_types";
import i18n from "../../../config/i18n";

export interface TopLevelSelectionViewTopBarProps {
  navigation: TopLevelSelectionViewNavigationProp;
}

export interface TopLevelSelectionViewTopBarState {}

//TODO: get back to ProductListView using data from CategoryList
const TopLevelSelectionViewTopBar: FC<TopLevelSelectionViewTopBarProps> = (
  props: TopLevelSelectionViewTopBarProps
) => {
  // state = { :  }
  return (
    <Header style={styles.header}>
      <Left>
        <Button
          transparent
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="md-arrow-back" size={24} color="white" />
        </Button>
      </Left>
      <Body>
        <Title style={styles.title}>{i18n.t("selection")}</Title>
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

export default TopLevelSelectionViewTopBar;
