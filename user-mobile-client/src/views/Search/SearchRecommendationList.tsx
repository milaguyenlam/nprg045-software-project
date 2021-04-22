import React, { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Text, List, ListItem, Button, Content } from "native-base";
import i18n from "../../../config/i18n";
import { SearchViewState } from "./SearchView";

export interface SearchRecommendationListProps {
  searchRecommendations: string[];
  setSearchState: React.Dispatch<React.SetStateAction<SearchViewState>>;
}

export interface SearchRecommendationListState {}

const SearchRecommendationList: FC<SearchRecommendationListProps> = (
  props: SearchRecommendationListProps
) => {
  return (
    <Content style={styles.searchContainer}>
      <List>
        <ListItem itemDivider>
          <Text>{i18n.t("recommended")}</Text>
        </ListItem>
        {props.searchRecommendations.map((string, index) => (
          <ListItem key={index}>
            <Text style={styles.recommendationString}>{string}</Text>
            <Button transparent style={styles.deleteButton}>
              <Entypo name="cross" size={20} color="grey" />
            </Button>
          </ListItem>
        ))}
      </List>
    </Content>
  );
};

const styles = StyleSheet.create({
  searchContainer: {},
  recommendationItem: {
    flexDirection: "row",
  },
  recommendationString: {
    flex: 17,
  },
  deleteButton: {
    flex: 1,
    alignSelf: "center",
    maxHeight: 10,
  },
});

export default SearchRecommendationList;
