import { Input, Item, Label } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../../config/i18n";
import { LoginViewState } from "../LoginView";
import { SignupViewState } from "../../Signup/SignupView";

export interface UsernameFormProps {
  setSearchState: React.Dispatch<React.SetStateAction<LoginViewState>>;
  state: LoginViewState;
}

export interface UsernameFormState {}

const UsernameForm: FC<UsernameFormProps> = (props: UsernameFormProps) => {
  return (
    <Item stackedLabel>
      <Label style={styles.label}>{i18n.t("email")}</Label>
      <Input
        placeholder={i18n.t("enterEmail")}
        onChangeText={(text) => {
          props.setSearchState({
            email: text,
            password: props.state.password,
            message: props.state.message,
          });
        }}
      />
    </Item>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    color: "green",
  },
});

export default UsernameForm;
