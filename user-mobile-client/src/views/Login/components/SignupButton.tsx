import { Button, Text } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../../config/i18n";
import { LoginViewState } from "../LoginView";
import { LoginViewNavigationProp } from "../../../navigation_types";

export interface SignupButtonProps {
  navigation: LoginViewNavigationProp;
  state: LoginViewState;
}

export interface SignupButtonState {}

const SignupButton: FC<SignupButtonProps> = (props: SignupButtonProps) => {
  return (
    <Button
      style={styles.signUpButton}
      block
      rounded
      onPress={() => {
        props.navigation.navigate("SignupView");
      }}
    >
      <Text style={styles.greenText}>{i18n.t("signupAction")}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  signUpButton: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "green",
    borderWidth: 1,
    marginTop: "3%",
    marginHorizontal: "10%",
  },
  greenText: {
    color: "green",
  },
});

export default SignupButton;
