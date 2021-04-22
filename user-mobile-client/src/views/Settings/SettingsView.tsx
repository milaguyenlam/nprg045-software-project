import { Container } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import {
  SettingsViewNavigationProp,
  SettingsViewRouteProp,
} from "../../navigation_types";
import TopBar from "./TopBar";
import SettingsPage from "./SettingsPage";
import NavigationBar from "./NavigationBar";

export interface SettingsViewProps {
  navigation: SettingsViewNavigationProp;
  route: SettingsViewRouteProp;
}

export interface SettingsViewState {}

const SettingsView: FC<SettingsViewProps> = (props: SettingsViewProps) => {
  return (
    <Container>
      <TopBar navigation={props.navigation} />
      <SettingsPage navigation={props.navigation} />
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default SettingsView;
