import { ApolloError } from "@apollo/client";
import { Content, Left, List, ListItem, Text, View } from "native-base";
import React, { FC } from "react";
import i18n from "../../../config/i18n";
import {
  Vendor_GetSelectionItems,
  Category_GetSelectionItems,
} from "../../../services/generated";
import { TopLevelSelectionViewNavigationProp } from "../../navigation_types";
import SplashScreenView from "../SplashScreen/SplashScreenView";
import CategoryTopLevelSelectionListItem from "./CategoryTopLevelSelectionListItem";
import VendorTopLevelSelectionListItem from "./VendorTopLevelSelectionListItem";
import ErrorPage from "../../shared/ErrorPage";

export interface TopLevelListProps {
  navigation: TopLevelSelectionViewNavigationProp;
  loading: boolean;
  error: ApolloError | undefined;
  topLevelCategories: Category_GetSelectionItems[] | undefined;
  vendors: Vendor_GetSelectionItems[] | undefined;
}

export interface TopLevelListState {}

const TopLevelSelectionList: FC<TopLevelListProps> = (
  props: TopLevelListProps
) => {
  if (props.loading) {
    return <SplashScreenView />;
  }
  if (props.error) {
    return <ErrorPage navigation={props.navigation} error={props.error} />;
  }
  return (
    <Content>
      <List>
        <ListItem itemDivider>
          <Text>{i18n.t("vendors")}</Text>
        </ListItem>
        {props.vendors?.map((vendor, index) => {
          return (
            <VendorTopLevelSelectionListItem
              navigation={props.navigation}
              vendor={vendor}
              key={index}
            />
          );
        })}
        <ListItem itemDivider>
          <Text>{i18n.t("categories")}</Text>
        </ListItem>
        {props.topLevelCategories?.map((cat, index) => {
          return (
            <CategoryTopLevelSelectionListItem
              navigation={props.navigation}
              category={cat}
              key={index}
            />
          );
        })}
      </List>
    </Content>
  );
};

export default TopLevelSelectionList;
