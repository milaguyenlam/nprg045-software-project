import { Container } from "native-base";
import React, { FC, useEffect, useState } from "react";
import TopBar from "./TopBar";
import SearchResultList from "./SearchResultList";
import SearchRecommendationList from "./SearchRecommendationList";
import { RootStackParamList } from "../../navigation_types";
import { useGetSearchResultLazyQuery } from "../../../services/generated";
import { StackNavigationProp } from "@react-navigation/stack";

//TODO: add correct navigation type and to all children
export interface SearchViewProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

export interface SearchViewState {
  searchString: string;
}

//FIXME: this is a hardcoded value, recommendations should be fetched from server based on user history
const searchRecommendationsExample: string[] = [
  "zrnková káva",
  "nealkoholické pivo",
  "ovocný jogurt",
];

const searchWordMinimumLength = 3;

const SearchView: FC<SearchViewProps> = (props: SearchViewProps) => {
  const [state, setState] = useState<SearchViewState>({
    searchString: "",
  });

  const [
    fetchSearchResult,
    { loading, error, data },
  ] = useGetSearchResultLazyQuery();

  useEffect(() => {
    if (state.searchString.length > searchWordMinimumLength) {
      fetchSearchResult({
        variables: {
          text: state.searchString,
        },
      });
    }
  }, [state.searchString]);

  return (
    <Container>
      <TopBar navigation={props.navigation} setSearchState={setState} />
      {searchResult(state.searchString.length)}
    </Container>
  );

  function searchResult(length: number) {
    if (length <= searchWordMinimumLength) {
      return (
        <SearchRecommendationList
          searchRecommendations={searchRecommendationsExample}
          setSearchState={setState}
        />
      );
    } else {
      return (
        <SearchResultList
          navigation={props.navigation}
          loading={loading}
          error={error}
          searchResult={data?.searchResult}
        />
      );
    }
  }
};

export default SearchView;
