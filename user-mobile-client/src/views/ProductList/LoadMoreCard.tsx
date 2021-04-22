import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Button, Card, CardItem, Spinner, Text } from "native-base";
import i18n from "../../../config/i18n";
import { ProductListViewState, productsOnPageLimit } from "./ProductListView";

export interface LoadMoreCardProps {
  fetchModeActiveProducts: Function;
  setState: React.Dispatch<React.SetStateAction<ProductListViewState>>;
  offset: number;
  loading: boolean;
}

export interface LoadMoreCardState {}

const LoadMoreCard: FC<LoadMoreCardProps> = (props: LoadMoreCardProps) => {
  if (props.loading) {
    return <Spinner color="green" size={70} />;
  } else {
    return (
      <Card transparent style={styles.card}>
        <CardItem
          style={styles.cardItem}
          button
          onPress={() => {
            props.setState({
              offset: props.offset + productsOnPageLimit,
            });
            props.fetchModeActiveProducts({
              variables: {
                offset: props.offset,
              },
            });
          }}
        >
          <Button
            transparent
            style={styles.button}
            onPress={() => {
              props.setState({
                offset: props.offset + productsOnPageLimit,
              });
              props.fetchModeActiveProducts({
                variables: {
                  offset: props.offset,
                },
              });
            }}
          >
            <Text style={styles.buttonText}>{i18n.t("loadMore")}</Text>
          </Button>
        </CardItem>
      </Card>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonText: {
    color: "green",
  },
  button: {
    alignSelf: "center",
  },
  cardItem: {
    flexDirection: "column",
  },
});

export default LoadMoreCard;
