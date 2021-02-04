import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import categoryComponent from "../Components/CategoryComponent";
import {
  StyleSheet,
  Button,
  Image,
  View,
  Platform,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

class AddCategoryScreen extends React.Component {
  state = {
    imageURI: "",
    categoryName: "",
  };
  componentDidMount() {
    (async () => {
      if (Platform.OS !== "web") {
        console.log("Requesting camera permissions");
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        console.log(status);
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }

  pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ imageURI: result.uri });
    }
  };

  submitForm = () => {
    categoryComponent.add(this.state);
  };
  handleCategoryText = (text) => {
    this.setState({ categoryName: text });
  };

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          onChangeText={this.handleCategoryText}
        />
        <Button
          title="Pick an image from camera roll"
          onPress={this.pickImage}
        />
        {this.state.imageURI.length > 0 && (
          <Image
            source={{ uri: this.state.imageURI }}
            style={{ width: 200, height: 200 }}
          />
        )}

        <Button title="submit" onPress={this.submitForm} />
      </SafeAreaView>
    );
  }
}
export default AddCategoryScreen;
const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  input: {
    margin: 15,
    height: 40,
    width: 150,
    borderColor: "#7a42f4",
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: "#7a42f4",
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    color: "white",
  },
});
