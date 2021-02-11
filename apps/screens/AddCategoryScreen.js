import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import categoryComponent from "../Components/CategoryComponent";
import DropDownPicker from "react-native-dropdown-picker";

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
    dropdownSelectedItem: "",
    dropdownItems: [{ label: "None", value: "" }],
    message: "form loaded successfully",
    isError: false,
  };

  componentDidMount = () => {
    this.mounted = true;
    categoryComponent.fetchPreLoadedImageItems(this);
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
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

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
    categoryComponent.add(this.state, this);
  };
  handleCategoryText = (text) => {
    this.setState({ categoryName: text });
  };

  handleDropDownText(event) {
    this.setState({ value: event.target.value });
  }
  handleReset = () => {
    this.setState({
      imageURI: "",
      categoryName: "",
      dropdownSelectedItem: "",
      dropdownItems: [{ label: "None", value: "" }],
      message: "",
      isError: false,
    });
  };

  buildToastMessage = () => {
    return (
      <View
        style={[
          styles.categoryToastMessage,
          this.state.isError
            ? { backgroundColor: "red" }
            : { backgroundColor: "green" },
        ]}
      >
        <Icon
          name={this.state.isError ? "exclamation-triangle" : "check-circle"}
          style={{ color: "white", width: "10%", fontSize: 20 }}
        ></Icon>
        <Text
          style={{
            color: "white",
            width: "80%",
            fontSize: 15,
          }}
        >
          {(console.log(this.state.message), this.state.message)}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.categoryScreenWrapper}>
        <View style={styles.categoryHeaderWrapper}>
          <View style={styles.categoryHeaderIconWrapper}>
            <Icon
              name="arrow-left"
              onPress={() =>
                this.props.navigation.navigate("AddCategoryScreen")
              }
              style={styles.categoryHeaderIcon}
            />
          </View>

          <View style={styles.categoryHeaderTextWrapper}>
            <Text style={styles.categoryHeaderText}>Add New category</Text>
            <Icon
              name="undo"
              onPress={this.handleReset}
              style={styles.categoryHeaderIcon}
            />
          </View>
        </View>
        {this.state.message.length > 0
          ? this.buildToastMessage()
          : console.log("no message")}

        <View style={styles.addCategoryBody}>
          <TextInput
            style={styles.input}
            placeholder={"please enter a category name"}
            editable
            maxLength={40}
            value={this.state.categoryName}
            onChangeText={this.handleCategoryText}
          />

          {this.state.imageURI.length > 0 ? (
            <Image
              source={{ uri: this.state.imageURI }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Icon
              name="camera"
              style={styles.cameraIcon}
              onPress={this.pickImage}
            />
          )}

          <Text style={{ color: "#808080", marginTop: "5%" }}>
            --------------- OR ---------------
          </Text>

          <DropDownPicker
            items={this.state.dropdownItems}
            defaultValue={this.state.dropdownSelectedItem}
            containerStyle={{ height: 45, width: "100%", marginTop: "5%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => {
              this.setState({
                dropdownSelectedItem: item.value,
              });
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "#2f52a4",
              backgroundColor: "#d3d3d3",
              marginTop: "5%",
              width: "50%",
            }}
          >
            <Text
              style={{
                padding: 10,
                color: "white",
                fontSize: 17,
                width: "50%",
              }}
              color="white"
              onPress={this.submitForm}
            >
              SUBMIT
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default AddCategoryScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  addCategoryBody: {
    width: "90%",
    alignItems: "center",
    flex: 1,
    marginTop: "5%",
  },
  input: {
    margin: 15,
    height: 40,
    width: "100%",
    borderColor: "#808080",
    borderWidth: 1,
    marginTop: "5%",
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
  categoryScreenWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F0F2F5",
  },
  cameraroll: {
    borderColor: "#808080",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryHeaderWrapper: {
    color: "white",
    backgroundColor: "#EF6465",
    width: "90%",
    height: "6%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  categoryHeaderTextWrapper: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  categoryHeaderText: {
    fontFamily: "AppleSDGothicNeo-Regular",
    fontSize: 25,
    color: "white",
    fontWeight: "700",
    marginLeft: 10,
  },

  categoryHeaderIconWrapper: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  categoryHeaderIcon: {
    fontSize: 30,
    color: "#fff",
  },
  categoryComponentWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,

    width: "95%",
    height: 115,
    marginTop: 15,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "white",
  },

  categoryPictureWrapper: {
    width: "35%",
    height: "100%",
  },
  categoryPicture: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  categoryDetailsWrapper: {
    width: "65%",
    height: "100%",
    padding: "3%",
  },

  categoryDetailsNameText: {
    fontSize: 22,
    fontFamily: "AppleSDGothicNeo-Regular",
    marginTop: 5,

    fontWeight: "500",
  },
  categoryDetailsQuantityText: {
    fontSize: 15,
    fontFamily: "AppleSDGothicNeo-Regular",
  },
  categoryDetailsQuanityUnitText: {
    backgroundColor: "green",
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
  },
  categoryDetailsQuanityUnitWarningText: {
    backgroundColor: "red",
    color: "white",
    fontWeight: "600",
    marginLeft: 5,
  },
  categoryLastUpdatedTime: {
    backgroundColor: "#F0A640",
    color: "white",
    fontWeight: "600",
    fontFamily: "AppleSDGothicNeo-Regular",
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 15,
    shadowColor: "#F0A640",
    shadowOffset: { width: 5, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 2,
  },

  categoryDetailsIcon: {
    fontSize: 30,
    //color: "#939393",
    color: "#900",
  },
  cameraIcon: {
    fontSize: 100,
    //color: "#939393",
    color: "#808080",
    marginTop: "5%",
  },
  categoryToastMessage: {
    flexDirection: "row",
    justifyContent: "center",
    height: 30,
    width: "90%",
    alignItems: "center",
  },
});
