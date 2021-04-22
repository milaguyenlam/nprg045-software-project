import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { Fab } from "native-base";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import i18n from "../../../config/i18n";
import { FilterType } from "../../../services/generated";
import {
  ProductListViewNavigationProp,
  ProductListViewRouteProp,
  RootStackParamList,
  TopLevelSelectionViewNavigationProp,
} from "../../navigation_types";

export interface RemoveFilterFabProps {
  navigation: ProductListViewNavigationProp;
  route: ProductListViewRouteProp;
}

export interface RemoveFilterFabState {}

const RemoveFilterFab: FC<RemoveFilterFabProps> = (
  props: RemoveFilterFabProps
) => {
  if (props.route.params.selectedFilterType === FilterType.All) {
    return null;
  }
  return (
    <Fab
      position="bottomRight"
      active={true}
      style={styles.fab}
      onPress={() => {
        props.navigation.setParams({
          selectedVendorId: null,
          selectedCategoryIds: null,
          selectedEntityName: i18n.t("allProducts"),
          selectedFilterType: FilterType.All,
        });
      }}
    >
      <MaterialCommunityIcons name="filter-remove" size={24} color="white" />
    </Fab>
  );
};

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "green",
  },
});
export default RemoveFilterFab;
