import { Container, View } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import UserProfilePage from "./UserProfilePage";
import TopBar from "./TopBar";
import { SettingsViewNavigationProp } from "../../navigation_types";
import { useGetCurrentUser } from "../../../services/generated";
import NavigationBar from "../Settings/NavigationBar";

export interface UserProfileViewProps {
  navigation: SettingsViewNavigationProp;
}

export interface UserProfileViewState {}

const UserProfileView: FC<UserProfileViewProps> = (
  props: UserProfileViewProps
) => {
  const { loading, data, error } = useGetCurrentUser();

  return (
    <Container>
      <TopBar navigation={props.navigation} />
      <UserProfilePage
        navigation={props.navigation}
        user={data?.currentUser}
        loading={loading}
        error={error}
      />
      <NavigationBar navigation={props.navigation} />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default UserProfileView;
