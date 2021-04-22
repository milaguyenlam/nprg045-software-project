import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Body, Button, Header, Left, Title, Right } from "native-base";
import {
  CategorySelectionViewRouteProp,
  RootStackParamList,
  TopLevelSelectionViewNavigationProp,
} from "../../navigation_types";
import { StackNavigationProp } from "@react-navigation/stack";

export interface TopBarProps {
  navigation: TopLevelSelectionViewNavigationProp;
  route: CategorySelectionViewRouteProp;
}

export interface TopBarState {}

//TODO: get back to ProductListView using data from CategoryList
const TopBar: FC<TopBarProps> = (props: TopBarProps) => {
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
        <Title style={styles.title}>{props.route.params.category.name}</Title>
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
