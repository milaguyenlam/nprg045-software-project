import { ApolloError } from "@apollo/client";
import { Button, Container, Text } from "native-base";
import {
  FavouriteListViewNavigationProp,
  LoginViewNavigationProp,
  RootStackParamList,
  SettingsViewNavigationProp,
  ShoppingListViewNavigationProp,
  SignupViewNavigationProp,
  TopLevelSelectionViewNavigationProp,
} from "../navigation_types";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../config/i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

export interface ErrorPageProps {
  error: ApolloError | Error | undefined | null;
  //TODO: rewrite me
  navigation:
    | StackNavigationProp<RootStackParamList>
    | LoginViewNavigationProp
    | FavouriteListViewNavigationProp
    | SettingsViewNavigationProp
    | SignupViewNavigationProp
    | ShoppingListViewNavigationProp
    | TopLevelSelectionViewNavigationProp;
}

export interface ErrorPageState {}

//TODO: report functionality in reportButton
const ErrorPage: FC<ErrorPageProps> = (props: ErrorPageProps) => {
  return (
    <Container style={styles.container}>
      <MaterialCommunityIcons
        style={styles.alertIcon}
        name="alert"
        size={100}
        color="gray"
      />
      <Text style={styles.oops}>Oooppps! Something went wrong...</Text>
      <Text style={styles.error}>{props.error?.message}</Text>
      <Button
        style={styles.reloadButton}
        block
        rounded
        onPress={() => props.navigation.goBack()}
      >
        <MaterialCommunityIcons name="reload" size={24} color="white" />
        <Text style={styles.whiteText}>{i18n.t("reload")}</Text>
      </Button>
      <Button style={styles.reportButton} block rounded onPress={() => {}}>
        <MaterialCommunityIcons name="bug" size={24} color="white" />
        <Text style={styles.whiteText}>{i18n.t("report")}</Text>
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: "5%",
  },
  reloadButton: {
    flex: 1,
    backgroundColor: "green",
    marginHorizontal: "28%",
  },
  reportButton: {
    marginTop: "2%",
    backgroundColor: "green",
    marginHorizontal: "28%",
    flex: 1,
  },
  error: {
    flex: 5,
    marginHorizontal: "5%",
    marginTop: "2%",
    color: "gray",
    justifyContent: "center",
  },
  oops: {
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    marginHorizontal: "5%",
    textAlign: "center",
  },
  whiteText: {
    color: "white",
  },
  alertIcon: {
    textAlign: "center",
  },
});

export default ErrorPage;
