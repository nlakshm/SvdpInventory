import React from "react";
import { View, Text, Button } from "react-native";
export default class Test extends React.Component {
  state = {};

  onPress = () => {};

  render() {
    return (
      <View style={{ paddingTop: 25 }}>
        <Text></Text>
        <Button title="Change Text" onPress={this.onPress} />
      </View>
    );
  }
}
