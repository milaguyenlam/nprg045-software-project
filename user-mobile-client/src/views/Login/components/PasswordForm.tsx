import { Input, Item, Label } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../../config/i18n";
import { LoginViewState } from "../LoginView";

export interface PasswordFormProps {
  setFormState: React.Dispatch<React.SetStateAction<LoginViewState>>;
  state: LoginViewState;
}

export interface PasswordFormState {}

const PasswordForm: FC<PasswordFormProps> = (props: PasswordFormProps) => {
  return (
    <Item stackedLabel>
      <Label style={styles.label}>{i18n.t("password")}</Label>
      <Input
        placeholder={i18n.t("enterPassword")}
        onChangeText={(text) => {
          props.setFormState({
            email: props.state.email,
            password: text,
            message: props.state.message,
          });
        }}
        secureTextEntry={true}
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

export default PasswordForm;
