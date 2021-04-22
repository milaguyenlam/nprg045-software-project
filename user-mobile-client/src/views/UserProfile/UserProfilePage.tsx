import { ApolloError } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Container,
  Thumbnail,
  View,
  Text,
  List,
  ListItem,
  Content,
  Spinner,
} from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { User_GetCurrentUser } from "../../../services/generated";
import { SettingsViewNavigationProp } from "../../navigation_types";
import ErrorPage from "../../shared/ErrorPage";

export interface UserProfilePageProps {
  user: User_GetCurrentUser | undefined;
  error: ApolloError | undefined;
  loading: boolean;
  navigation: SettingsViewNavigationProp;
}

const blankProfilePicture =
  "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png";

export interface UserProfilePageState {}

//TODO: add profilePicturePath to User
const UserProfilePage: FC<UserProfilePageProps> = (
  props: UserProfilePageProps
) => {
  if (props.loading) {
    return (
      <Content>
        <Spinner color="green" style={styles.loadingSpinner}></Spinner>
      </Content>
    );
  }
  if (props.error) {
    return (
      <Container>
        <ErrorPage
          navigation={props.navigation}
          error={props.error}
        ></ErrorPage>
      </Container>
    );
  }

  return (
    <Container style={styles.page}>
      <View style={styles.top}>
        <Thumbnail
          large
          source={{
            uri: blankProfilePicture,
          }}
          style={styles.profilePicture}
        />
        <Text>{props.user?.username}</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.page}>
        <List>
          <ListItem itemHeader>
            <Text>PERSONAL INFO</Text>
          </ListItem>
          <ListItem style={styles.listItemInfo}>
            <MaterialCommunityIcons
              name="at"
              size={12}
              color="green"
              style={styles.atIcon}
            />
            <Text>{props.user?.username}</Text>
          </ListItem>
        </List>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  loadingSpinner: {},
  text: {
    flex: 1,
  },
  atIcon: {
    flex: 1,
  },
  listItemInfo: {
    flexDirection: "row",
  },
  page: {
    flex: 8,
  },
  profilePicture: {
    borderColor: "grey",
    borderWidth: 1,
    marginTop: "10%",
  },
  top: {
    flex: 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    flex: 0.03,
    backgroundColor: "green",
  },
});

export default UserProfilePage;
