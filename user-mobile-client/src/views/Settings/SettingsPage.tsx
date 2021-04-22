import { List, ListItem, View, Text } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { SettingsViewNavigationProp } from "../../navigation_types";
import { productsOnPageLimit } from "../ProductList/ProductListView";
import SettingCard from "./SettingCard";

export interface SettingsPageProps {
  navigation: SettingsViewNavigationProp;
}

export interface SettingsPageState {}

//TODO: add relevant Settings child components
const SettingsPage: FC<SettingsPageProps> = (props: SettingsPageProps) => {
  return (
    <View style={styles.page}>
      <List>
        <ListItem
          itemHeader
          button
          onPress={() => {
            props.navigation.navigate("UserProfileView");
          }}
        >
          <Text>USERPROFILE</Text>
        </ListItem>
        <ListItem itemHeader>
          <Text>GENERAL SETTINGS</Text>
        </ListItem>
        <SettingCard settingName="Dark mode" iconCode="brightness-6" />
        <SettingCard settingName="Dark mode" iconCode="brightness-6" />

        <ListItem itemHeader>
          <Text>SOME OTHER SETTINGS</Text>
        </ListItem>
        <SettingCard settingName="Dark mode" iconCode="brightness-6" />

        <ListItem itemHeader>
          <Text>SOME DIFFERENT SETTINGS</Text>
        </ListItem>
        <SettingCard settingName="Dark mode" iconCode="brightness-6" />
        <SettingCard settingName="Dark mode" iconCode="brightness-6" />
      </List>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});

export default SettingsPage;
