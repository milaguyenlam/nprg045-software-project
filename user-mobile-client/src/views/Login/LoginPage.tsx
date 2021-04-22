import { Content, Form, Label, Thumbnail, View } from "native-base";
import React, { FC } from "react";
import { LoginViewState } from "./LoginView";
import EmailForm from "./components/EmailForm";
import ForgotButton from "./components/ForgotButton";
import PasswordForm from "./components/PasswordForm";
import SigninButton from "./components/SigninButton";
import SignupButton from "./components/SignupButton";
import { StyleSheet } from "react-native";
import { QueryLazyOptions } from "@apollo/client";
import { Exact } from "../../../services/generated";
import { LoginViewNavigationProp } from "../../navigation_types";

export interface LoginPageProps {
  setState: React.Dispatch<React.SetStateAction<LoginViewState>>;
  state: LoginViewState;
  navigation: LoginViewNavigationProp;
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

export interface LoginPageState {}

const LoginPage: FC<LoginPageProps> = (props: LoginPageProps) => {
  return (
    <>
      <View style={styles.top}>
        <Thumbnail
          source={require("../../../assets/images/sprice-logo.png")}
          large
        />
      </View>
      <View style={styles.loginForm}>
        <Content>
          <Form>
            <EmailForm setState={props.setState} state={props.state} />
            <PasswordForm setFormState={props.setState} state={props.state} />
          </Form>
          <Label style={{ color: "red", margin: 10 }}>
            {props.state.message}
          </Label>
          <View>
            <SigninButton
              fetchAuthentication={props.fetchAuthentication}
              navigation={props.navigation}
              state={props.state}
            />

            <SignupButton navigation={props.navigation} state={props.state} />

            <ForgotButton />
          </View>
          <View style={styles.seperationLine} />
        </Content>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  top: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  loginForm: {
    flex: 3,
  },
  seperationLine: {
    backgroundColor: "green",
    flex: 0.01,
  },
});

export default LoginPage;
