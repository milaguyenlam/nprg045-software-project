import { Container, Content, Spinner, Text, View } from "native-base";
import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";

export interface SplashScreenViewProps {}

export interface SplashScreenViewState {}

const SplashScreenView: FC<SplashScreenViewProps> = (
  props: SplashScreenViewProps
) => {
  return (
    <Container style={styles.content}>
      <Content>
        <Spinner color="green" style={styles.loadingSpinner} size={70} />
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginVertical: "5%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
  },
  loadingSpinner: {
    marginTop: "20%",
  },
});

export default SplashScreenView;
