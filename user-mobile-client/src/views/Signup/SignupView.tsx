import { StackNavigationProp } from "@react-navigation/stack";
import {
  Button,
  Container,
  Content,
  Form,
  Label,
  View,
  Text,
  Input,
  Item,
  Thumbnail,
} from "native-base";
import React, { FC, useState } from "react";
import { StyleSheet, Image } from "react-native";
import i18n from "../../../config/i18n";
import { useRegister } from "../../../services/generated";
import { saveToken } from "../../../services/secure_storage";
import ErrorPage from "../../shared/ErrorPage";
import TopBar from "./TopBar";
import {
  ProductListViewDefaultVariables,
  SignupViewNavigationProp,
} from "../../navigation_types";

export interface SignupViewProps {
  navigation: SignupViewNavigationProp;
}

export interface SignupViewState {
  email: string;
  password: string;
  username: string;
  message: string | undefined;
}

const SignupView: FC<SignupViewProps> = (props: SignupViewProps) => {
  const [state, setState] = useState<SignupViewState>({
    email: "",
    password: "",
    username: "",
    message: undefined,
  });

  const [register, { data, loading, error }] = useRegister();

  if (data?.register.status === true && data.register.token) {
    saveToken(data.register.token).then(() => {
      props.navigation.navigate(
        "ProductListView",
        ProductListViewDefaultVariables
      );
    });
  }

  if (data?.register.status === false && state.message === undefined) {
    setState({
      email: "",
      password: "",
      username: "",
      message: data.register.message,
    });
  }

  if (error) {
    return (
      <Container>
        <TopBar navigation={props.navigation} />
        <ErrorPage navigation={props.navigation} error={error} />
      </Container>
    );
  }
  //TODO: refactor me
  return (
    <Container>
      <TopBar navigation={props.navigation} />
      <View style={styles.top}>
        <Thumbnail
          source={require("../../../assets/images/sprice-logo.png")}
          large
        />
      </View>
      <View style={styles.signupForm}>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label style={styles.label}>{i18n.t("email")}</Label>
              <Input
                placeholder={i18n.t("enterEmail")}
                onChangeText={(text) => {
                  setState({
                    email: text,
                    password: state.password,
                    username: state.username,
                    message: state.message,
                  });
                }}
              />
            </Item>
            <Item stackedLabel>
              <Label style={styles.label}>{i18n.t("username")}</Label>
              <Input
                placeholder={i18n.t("enterUsername")}
                onChangeText={(text) => {
                  setState({
                    email: state.email,
                    password: state.password,
                    username: text,
                    message: state.message,
                  });
                }}
              />
            </Item>
            <Item stackedLabel>
              <Label style={styles.label}>{i18n.t("password")}</Label>
              <Input
                placeholder={i18n.t("enterPassword")}
                onChangeText={(text) => {
                  setState({
                    email: state.email,
                    password: text,
                    username: state.username,
                    message: state.message,
                  });
                }}
                secureTextEntry={true}
              />
            </Item>
          </Form>
          <Label style={{ color: "red", margin: 10 }}>{state.message}</Label>
          <Button
            block
            rounded
            style={styles.signUpButton}
            onPress={() => {
              registerUser();
            }}
          >
            <Text>{i18n.t("signupAction")}</Text>
          </Button>
        </Content>
      </View>
    </Container>
  );

  function registerUser(): void {
    register({
      variables: {
        registerForm: {
          email: state.email,
          username: state.username,
          password: state.password,
        },
      },
    });
  }
};

const styles = StyleSheet.create({
  top: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  signupForm: {
    flex: 3,
  },
  topThird: {
    backgroundColor: "green",
  },
  label: {
    fontWeight: "bold",
    color: "green",
  },
  signUpButton: {
    backgroundColor: "green",
    marginHorizontal: "10%",
    marginTop: "5%",
  },
});

export default SignupView;
