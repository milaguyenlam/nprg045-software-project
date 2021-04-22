import React, { FC } from "react";
import ProductListView from "./src/views/ProductList/ProductListView";
import * as Font from "expo-font";
import { ApolloProvider } from "@apollo/client";
import TopLevelSelectionView from "./src/views/TopLevelSelection/TopLevelSelectionView";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import ProductView from "./src/views/Product/ProductView";
import SearchView from "./src/views/Search/SearchView";
import { RootStackParamList } from "./src/navigation_types";
import LoginView from "./src/views/Login/LoginView";
import SignupView from "./src/views/Signup/SignupView";
import SplashScreenView from "./src/views/SplashScreen/SplashScreenView";
import { Container } from "native-base";
import { client } from "./config/apollo";
import CategorySelectionView from "./src/views/CategorySelection/CategorySelectionView";
import SettingsView from "./src/views/Settings/SettingsView";
import UserProfileView from "./src/views/UserProfile/UserProfileView";
import ErrorPage from "./src/shared/ErrorPage";
import FavouriteListView from "./src/views/FavouriteList/FavouriteListView";
import ShoppingListView from "./src/views/ShoppingList/ShoppingListView";

export interface AppProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export interface AppState {}

//TODO: wrap app configuration into to class/function
//TODO: wrap loading resources (splash screen while loading)
//TODO: status bar customization

const RootStack = createStackNavigator<RootStackParamList>();

export const App: FC<AppProps> = (props: AppProps) => {
  const [loaded, error] = Font.useFonts({
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  });
  if (error) {
    return (
      <Container>
        <ErrorPage navigation={props.navigation} error={error}></ErrorPage>
      </Container>
    );
  }
  if (!loaded) {
    return <SplashScreenView></SplashScreenView>;
  }
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="LoginView"
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name="LoginView" component={LoginView} />
          <RootStack.Screen name="SignupView" component={SignupView} />
          <RootStack.Screen
            name="TopLevelSelectionView"
            component={TopLevelSelectionView}
          />
          <RootStack.Screen
            name="ProductListView"
            component={ProductListView}
          />
          <RootStack.Screen name="ProductView" component={ProductView} />
          <RootStack.Screen
            name="CategorySelectionView"
            component={CategorySelectionView}
          />
          <RootStack.Screen name="SearchView" component={SearchView} />
          <RootStack.Screen name="SettingsView" component={SettingsView} />
          <RootStack.Screen
            name="UserProfileView"
            component={UserProfileView}
          />
          <RootStack.Screen
            name="FavouriteListView"
            component={FavouriteListView}
          />
          <RootStack.Screen
            name="ShoppingListView"
            component={ShoppingListView}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
