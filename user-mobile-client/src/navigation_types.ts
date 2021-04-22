import { ApolloError } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import i18n from "../config/i18n";
import { Category_GetSelectionItems, FilterType } from "../services/generated";

export const ProductListViewDefaultVariables = {
  selectedVendorId: null,
  selectedCategoryIds: null,
  selectedEntityName: i18n.t("allProducts"),
  selectedFilterType: FilterType.All,
};

export type RootStackParamList = {
  ProductView: {
    productId: number;
  };
  ProductListView: {
    selectedEntityName: string;
    selectedVendorId: number | null;
    selectedCategoryIds: number[] | null;
    selectedFilterType: FilterType;
  };
  CategorySelectionView: {
    category: Category_GetSelectionItems;
  };
  ErrorView: {
    error: ApolloError;
  };
  TopLevelSelectionView: undefined;
  SettingsView: undefined;
  SearchView: undefined;
  LoginView: undefined;
  SignupView: undefined;
  UserProfileView: undefined;
  FavouriteListView: undefined;
  ShoppingListView: undefined;
  SalesView: undefined;
};

//StackScreenProps (NavigationProp + RouteProp) for every view component
export type ProductViewScreenProp = StackScreenProps<
  RootStackParamList,
  "ProductView"
>;
export type ProductListViewScreenProp = StackScreenProps<
  RootStackParamList,
  "ProductListView"
>;
export type CategorySelectionViewScreenProp = StackScreenProps<
  RootStackParamList,
  "CategorySelectionView"
>;
export type SearchViewScreenProp = StackScreenProps<
  RootStackParamList,
  "SearchView"
>;
export type TopLevelSelectionViewScreenProp = StackScreenProps<
  RootStackParamList,
  "TopLevelSelectionView"
>;
export type LoginViewScreenProp = StackScreenProps<
  RootStackParamList,
  "LoginView"
>;
export type SignupViewScreenProp = StackScreenProps<
  RootStackParamList,
  "SignupView"
>;
export type ErrorViewScreenProp = StackScreenProps<
  RootStackParamList,
  "ErrorView"
>;
export type SettingsViewScreenProp = StackScreenProps<
  RootStackParamList,
  "SettingsView"
>;
export type UserProfileViewProp = StackScreenProps<
  RootStackParamList,
  "UserProfileView"
>;
export type ShoppingListViewProp = StackScreenProps<
  RootStackParamList,
  "ShoppingListView"
>;
export type FavouriteListViewProp = StackScreenProps<
  RootStackParamList,
  "FavouriteListView"
>;
export type SalesViewProp = StackScreenProps<RootStackParamList, "SalesView">;

//StackNavigationProp for every view component
export type ProductViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductView"
>;
export type ProductListViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProductListView"
>;
export type CategorySelectionViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CategorySelectionView"
>;
export type SearchViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchView"
>;
export type TopLevelSelectionViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TopLevelSelectionView"
>;
export type LoginViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LoginView"
>;
export type SignupViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignupView"
>;
export type ErrorViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ErrorView"
>;
export type SettingsViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SettingsView"
>;
export type UserProfileViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserProfileView"
>;
export type ShoppingListViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ShoppingListView"
>;
export type FavouriteListViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FavouriteListView"
>;
export type SalesViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SalesView"
>;

//StackRouteProp for every view component
export type ProductViewRouteProp = RouteProp<RootStackParamList, "ProductView">;
export type ProductListViewRouteProp = RouteProp<
  RootStackParamList,
  "ProductListView"
>;
export type CategorySelectionViewRouteProp = RouteProp<
  RootStackParamList,
  "CategorySelectionView"
>;
export type SearchViewRouteProp = RouteProp<RootStackParamList, "SearchView">;
export type TopLevelSelectionViewRouteProp = RouteProp<
  RootStackParamList,
  "TopLevelSelectionView"
>;
export type LoginViewRouteProp = RouteProp<RootStackParamList, "LoginView">;
export type SignupViewRouteProp = RouteProp<RootStackParamList, "SignupView">;
export type ErrorViewRouteProp = RouteProp<RootStackParamList, "ErrorView">;
export type SettingsViewRouteProp = RouteProp<
  RootStackParamList,
  "SettingsView"
>;
export type UserProfileViewRouteProp = RouteProp<
  RootStackParamList,
  "UserProfileView"
>;
export type ShoppingListViewRouteProp = RouteProp<
  RootStackParamList,
  "ShoppingListView"
>;
export type FavouriteListViewRouteProp = RouteProp<
  RootStackParamList,
  "FavouriteListView"
>;
export type SalesViewRouteProp = RouteProp<RootStackParamList, "SalesView">;
