import { Input, Item, Label } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../../config/i18n";
import { LoginViewState } from "../LoginView";

export enum ViewTypes {
  LoginView,
  SignupView,
}

export interface EmailFormProps {
  setState: React.Dispatch<React.SetStateAction<LoginViewState>>;
  state: LoginViewState;
}

export interface EmailFormState {}

const EmailForm: FC<EmailFormProps> = (props: EmailFormProps) => {
  return (
    <Item stackedLabel>
      <Label style={styles.label}>{i18n.t("email")}</Label>
      <Input
        placeholder={i18n.t("enterEmail")}
        onChangeText={(text) => {
          props.setState({
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

export default EmailForm;
