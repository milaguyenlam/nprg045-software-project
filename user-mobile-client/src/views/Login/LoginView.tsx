import { Container } from "native-base";
import React, { FC, useState } from "react";
import { useAuthenticateLazyQuery } from "../../../services/generated";
import {
  LoginViewNavigationProp,
  ProductListViewDefaultVariables,
} from "../../navigation_types";
import { saveToken } from "../../../services/secure_storage";
import TopBar from "./TopBar";
import ErrorPage from "../../shared/ErrorPage";
import LoginPage from "./LoginPage";

export interface LoginViewProps {
  navigation: LoginViewNavigationProp;
}

export interface LoginViewState {
  email: string;
  password: string;
  message: string | undefined;
}

const LoginView: FC<LoginViewProps> = (props: LoginViewProps) => {
  const [state, setState] = useState<LoginViewState>({
    email: "",
    password: "",
    message: undefined,
  });

  const [
    fetchAuthentication,
    { loading, error, data },
  ] = useAuthenticateLazyQuery();

  if (data?.authenticate.status === true && data.authenticate.token) {
    saveToken(data.authenticate.token).then(() => {
      //TODO: pop LoginView screen from stack - make logging out possible through settings only
      props.navigation.navigate(
        "ProductListView",
        ProductListViewDefaultVariables
      );
    });
  }

  if (data?.authenticate.status === false && state.message === undefined) {
    setState({
      email: "",
      password: "",
      message: data.authenticate.message,
    });
  }

  if (error) {
    <Container>
      <TopBar />
      <ErrorPage navigation={props.navigation} error={error} />
    </Container>;
  }

  return (
    <Container>
      <TopBar />
      <LoginPage
        fetchAuthentication={fetchAuthentication}
        setState={setState}
        state={state}
        navigation={props.navigation}
      />
    </Container>
  );
};

export default LoginView;
