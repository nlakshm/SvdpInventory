import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import categoryComponent from "../Components/CategoryComponent";
import DropDownPicker from "react-native-dropdown-picker";

class SubCategoryScreen extends React.Component {
  state = {};

  render() {
    return (
      <SafeAreaView style={styles.categoryScreenWrapper}>
        <Text>{this.props.route.params.data.totalQuantity}</Text>
        <Text>Hello</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  categoryScreenWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F0F2F5",
  },
});
export default SubCategoryScreen;
