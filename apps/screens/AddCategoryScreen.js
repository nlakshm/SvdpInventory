import React from "react";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-navigation";
class AddCategoryScreen extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <Icon
          name="arrow-left"
          style={{ fontSize: 50 }}
          onPress={() => this.props.navigation.navigate("home")}
        />
      </SafeAreaView>
    );
  }
}
export default AddCategoryScreen;
