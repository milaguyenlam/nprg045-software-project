import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Body, Button, Header, Left, Right, Title } from "native-base";
import { SettingsViewNavigationProp } from "../../navigation_types";
import i18n from "../../../config/i18n";

export interface TopBarProps {
  navigation: SettingsViewNavigationProp;
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
        <Title style={styles.title}>{i18n.t("userProfile")}</Title>
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
