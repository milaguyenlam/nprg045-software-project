import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, List, ListItem, Spinner, Text } from "native-base";
import { RootStackParamList } from "../../navigation_types";
import i18n from "../../../config/i18n";
import { SearchResult_GetSearchResult } from "../../../services/generated";
import { ApolloError } from "@apollo/client";
import SearchResult from "./SearchResult";
import ErrorPage from "../../shared/ErrorPage";
import { StackNavigationProp } from "@react-navigation/stack";
import SplashScreenView from "../SplashScreen/SplashScreenView";

export interface SearchResultListProps {
  navigation: StackNavigationProp<RootStackParamList>;
  loading: boolean;
  error: ApolloError | undefined;
  searchResult: SearchResult_GetSearchResult | undefined;
}
export interface SearchResultListState {}

const SearchResultList: FC<SearchResultListProps> = (
  props: SearchResultListProps
) => {
  if (props.loading) {
    return <SplashScreenView></SplashScreenView>;
  }
  if (props.error) {
    return <ErrorPage navigation={props.navigation} error={props.error} />;
  }

  return (
    <Content style={styles.searchContainer}>
      <List>
        {renderDescription(
          props.searchResult?.vendors.length || 0,
          i18n.t("vendors")
        )}
        {props.searchResult?.vendors.map((vendor, index) => (
          <SearchResult
            index={index}
            navigation={props.navigation}
            vendor={vendor}
          />
        ))}
        {renderDescription(
          props.searchResult?.categories.length || 0,
          i18n.t("categories")
        )}
        {props.searchResult?.categories.map((category, index) => (
          <SearchResult
            index={index}
            navigation={props.navigation}
            category={category}
          />
        ))}
        {renderDescription(
          props.searchResult?.products.length || 0,
          i18n.t("productListings")
        )}
        {props.searchResult?.products.map((product, index) => (
          <SearchResult
            index={index}
            navigation={props.navigation}
            product={product}
          />
        ))}
      </List>
    </Content>
  );
};

function renderDescription(count: number, description: string) {
  if (count > 0) {
    return (
      <ListItem itemDivider>
        <Text>{description}</Text>
      </ListItem>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  searchContainer: {},
  loadingSpinner: {},
  productImage: {
    marginRight: 15,
    width: 40,
    height: 40,
  },
  vendorThumbnail: {
    width: 55,
    height: 30,
    marginRight: 15,
  },
});

export default SearchResultList;
