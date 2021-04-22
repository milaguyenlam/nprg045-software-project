import { Button, Text } from "native-base";
import React, { FC } from "react";
import i18n from "../../../../config/i18n";
import { StyleSheet, Image } from "react-native";

export interface ForgotButtonProps {}

export interface ForgotButtonState {}

//TODO: implement "forgot password" button
const ForgotButton: FC<ForgotButtonProps> = (props: ForgotButtonProps) => {
  return (
    <Button style={styles.forgotButton}>
      <Text style={styles.greyText}>{i18n.t("forgotPassword")}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  forgotButton: {
    flex: 1,
    backgroundColor: "white",
    marginTop: "1%",
  },
  greyText: {
    color: "grey",
  },
});

export default ForgotButton;
