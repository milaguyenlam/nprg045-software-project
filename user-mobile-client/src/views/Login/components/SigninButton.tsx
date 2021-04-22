import { QueryLazyOptions } from "@apollo/client";
import { Button, Text } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../../config/i18n";
import { Exact } from "../../../../services/generated";
import { LoginViewState } from "../LoginView";
import { LoginViewNavigationProp } from "../../../navigation_types";

export interface SigninButtonProps {
  navigation: LoginViewNavigationProp;
  state: LoginViewState;
  fetchAuthentication: (
    options?:
      | QueryLazyOptions<
          Exact<{
            email: string;
            password: string;
          }>
        >
      | undefined
  ) => void;
}

export interface SigninButtonState {}

const SigninButton: FC<SigninButtonProps> = (props: SigninButtonProps) => {
  return (
    <Button
      style={styles.signInButton}
      block
      rounded
      onPress={() => {
        authenticate(props.state.email, props.state.password);
      }}
    >
      <Text>{i18n.t("loginAction")}</Text>
    </Button>
  );

  function authenticate(email: string, password: string): void {
    props.fetchAuthentication({
      variables: {
        email: email,
        password: password,
      },
    });
  }
};

const styles = StyleSheet.create({
  signInButton: {
    flex: 1,
    backgroundColor: "green",
    marginHorizontal: "10%",
    marginTop: "5%",
  },
});

export default SigninButton;
