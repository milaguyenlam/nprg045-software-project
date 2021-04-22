import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Body, Button, Left, ListItem, Right, Switch, Text } from "native-base";
import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";

export interface SettingCardProps {
  settingName: string;
  iconCode: string;
}

export interface SettingCardState {
  isEnabled: boolean;
}

const SettingCard: FC<SettingCardProps> = (props: SettingCardProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((isEnabled) => !isEnabled);
  return (
    <ListItem icon>
      <Left>
        <Button style={styles.button} disabled>
          <MaterialCommunityIcons color="white" name="brightness-6" />
        </Button>
      </Left>
      <Body>
        <Text>Dark mode</Text>
      </Body>
      <Right>
        <Switch value={isEnabled} onValueChange={toggleSwitch} />
      </Right>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
  button: {
    backgroundColor: "green",
  },
  setting: {
    flexDirection: "row",
  },
  settingText: {
    flex: 1,
  },
});

export default SettingCard;
