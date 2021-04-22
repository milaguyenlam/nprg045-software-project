import React, { FC } from "react";
import { StyleSheet } from "react-native";

import { Body, Header, Left, Right, Title } from "native-base";
import i18n from "../../../config/i18n";

export interface TopBarProps {}

export interface TopBarState {}

const TopBar: FC<TopBarProps> = (props: TopBarProps) => {
  return (
    <Header style={styles.header}>
      <Left></Left>
      <Body>
        <Title style={styles.title}>{i18n.t("login")}</Title>
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
