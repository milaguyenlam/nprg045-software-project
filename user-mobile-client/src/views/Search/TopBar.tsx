import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Header, Icon, Input, Item } from "native-base";
import { SearchViewState } from "./SearchView";
import { RootStackParamList } from "../../navigation_types";
import i18n from "../../../config/i18n";
import { StackNavigationProp } from "@react-navigation/stack";

export interface TopBarProps {
  navigation: StackNavigationProp<RootStackParamList>;
  setSearchState: React.Dispatch<React.SetStateAction<SearchViewState>>;
}

export interface TopBarState {}

const TopBar: FC<TopBarProps> = (props: TopBarProps) => {
  return (
    <Header searchBar style={styles.root}>
      <Button
        transparent
        style={styles.backButton}
        onPress={() => props.navigation.goBack()}
      >
        <Ionicons name="md-arrow-back" size={24} color="white" />
      </Button>
      <Item style={styles.searchBar}>
        <Icon name="ios-search"></Icon>
        <Input
          placeholder={i18n.t("searchPlaceholder")}
          onChangeText={(text) => {
            props.setSearchState({
              searchString: text,
            });
          }}
        ></Input>
      </Item>
    </Header>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "green",
    flexDirection: "row",
  },
  searchBar: {
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15,
    flex: 15,
  },
  backButton: {
    flex: 1,
  },
});

export default TopBar;
