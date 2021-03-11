import { Text, Input } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import categoryComponent from "../Components/CategoryComponent";
import subCategoryComponent from "../Components/SubCategoryComponent";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import dateUtil from "../Utilities/dateUtil";

import {
  StyleSheet,
  Button,
  Image,
  View,
  Platform,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import SubCategoryScreen from "./SubCategoryScreen";
import { ScrollView } from "react-native-gesture-handler";

class AddSubCategoryScreen extends React.Component {
  state = {
    category: { name: "" },
    imageURI: "",
    name: "",
    totalQuantity: "",
    dropdownSelectedSubCategoryItem: "",
    dropdownSelectedLocationItem: "",
    dropdownItems: [{ label: "None", value: "" }],
    dropdownLocationItems: [],
    message: "form loaded successfully",
    isError: false,
    isSubmitButtonEnabled: true,
    operation: "",
    date: new Date(),
    currentDate: "",
    id: -1,
    isSubCategoryChanged: false,
    isSubCategoryImageURIChanged: false,
    isPreloadedItem: false,
    initialQuantity: 0,
    editName: "",
    imageID: -1,
  };

  modifyStateBasedOnOperation = () => {
    console.log("modify based on state");
    let operation = this.props.route.params.operation;
    let stateDct = {};
    stateDct["operation"] = operation;
    console.log("data from category screen");
    console.log(this.props.route.params);
    if (operation == "edit") {
      let subCategory = this.props.route.params.data;
      let category = {};
      category["id"] = subCategory.categoryId;
      category["name"] = subCategory.category;

      stateDct["category"] = category;
      stateDct["id"] = subCategory.id;
      stateDct["dropdownSelectedLocationItem"] = subCategory.location;
      stateDct["totalQuantity"] = subCategory.totalQuantity;
      stateDct["date"] = new Date(subCategory.lastUpdatedTime);
      stateDct["downloadURL"] = subCategory.downloadURL;
      stateDct["name"] = subCategory.name;
      stateDct["isPreloadedItem"] = subCategory.isPreloadedItem;
      stateDct["initialQuantity"] = subCategory.totalQuantity;
      stateDct["imageID"] = subCategory.imageID;

      if (!subCategory.isPreloadedItem) {
        stateDct["imageURI"] = subCategory.downloadURL;
        stateDct["editName"] = subCategory.name;
      } else {
        stateDct["dropdownSelectedSubCategoryItem"] = subCategory.name;
      }
      stateDct["operation"] = operation;
    } else if (operation == "add") {
      stateDct["category"] = this.props.route.params.category;
    }

    this.setState(stateDct);
  };

  componentDidMount = () => {
    this.mounted = true;
    this.modifyStateBasedOnOperation();

    categoryComponent.fetchPreLoadedImageItems(this);
    subCategoryComponent.fetchLocations(this);

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

  deletePickedImage = () => {
    this.setState({
      imageURI: "",
      subCategoryName: "",
      isSubCategoryImageURIChanged: true,
    });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({
        imageURI: result.uri,
        isSubCategoryImageURIChanged: true,
      });
    }
  };

  submitForm = () => {
    console.log("submiting form edit/add");
    if (this.state.isSubmitButtonEnabled) {
      this.setState({ isSubmitButtonEnabled: false });
      if (this.state.operation == "add") {
        subCategoryComponent.add(this.state, this);
      } else {
        subCategoryComponent.edit(this.state, this);
      }
    }
  };

  handleSubCategoryText = (text) => {
    this.setState({ name: text });
  };

  handleQuantityText = (text) => {
    console.log(text);
    var numbers = /^[0-9]+$/;

    if (text.match(numbers)) {
      this.setState({
        totalQuantity: text,
        message: "",
        isError: false,
      });
    } else if (text.length != 0) {
      this.setState({
        message: "Please enter numbers ony in quantity",
        isError: true,
        totalQuantity: "",
      });
    } else {
      this.setState({
        totalQuantity: "",
      });
    }
  };

  onChange = (event, selectedDate) => {
    let currentDate = selectedDate || date;
    let date = currentDate;
    currentDate = dateUtil.formatLocaleDateString(
      new Date(currentDate.toString()).toLocaleDateString()
    );
    currentDate = currentDate + " 00:00:00";

    this.setState({ currentDate: currentDate, date: date });
  };

  handleDropDownText(event) {
    this.setState({ value: event.target.value, isSubCategoryChanged: true });
  }
  handleReset = () => {
    this.setState({
      imageURI: "",
      name: "",
      dropdownSelectedSubcategoryItem: "",
      message: "reset successful",
      isError: false,
      isSubmitButtonEnabled: true,
      totalQuantity: "",
      dropdownSelectedLocationItem: "",
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
                this.props.navigation.navigate("SubCategoryScreen", {
                  data: this.state.category,
                })
              }
              style={styles.categoryHeaderIcon}
            />
          </View>

          <View style={styles.categoryHeaderTextWrapper}>
            <Text style={styles.categoryHeaderText}>Add Sub category</Text>
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

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
            maxLength={40}
            value={"Category " + this.state.category.name}
            onChangeText={this.handleCategoryText}
          />

          <DropDownPicker
            items={this.state.dropdownItems}
            containerStyle={{ height: 45, width: "100%", marginTop: 15 }}
            style={{ backgroundColor: "#fafafa", fontSize: 17 }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa", fontSize: 17 }}
            onChangeItem={(item) => {
              this.setState({
                dropdownSelectedSubCategoryItem: item.value,
                isSubCategoryChanged: true,
              });
            }}
            placeholder={
              this.state.dropdownSelectedSubCategoryItem.length > 0
                ? this.state.dropdownSelectedSubCategoryItem
                : "Please select a subcategory from the dropdown"
            }
          />

          <Text style={{ color: "#808080", marginTop: "5%" }}>
            --------------- OR ---------------
          </Text>

          {this.state.imageURI.length > 0 ? (
            <React.Fragment>
              <Image
                source={{ uri: this.state.imageURI }}
                style={{ width: 200, height: 200, marginTop: "5%" }}
              />
              <Icon
                name="minus-circle"
                style={styles.deleteIcon}
                onPress={this.deletePickedImage}
              />
              <TextInput
                style={styles.input}
                placeholder={"please enter a sub category name"}
                editable
                maxLength={40}
                value={this.state.name}
                onChangeText={this.handleSubCategoryText}
              />
            </React.Fragment>
          ) : (
            <Icon
              name="camera"
              style={styles.cameraIcon}
              onPress={this.pickImage}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder={"please enter total quantity in lbs"}
            editable
            value={this.state.totalQuantity.toString()}
            onChangeText={this.handleQuantityText}
          />
          <Text style={{ fontSize: 16, width: "100%", marginTop: 5 }}>
            Pick the date of expiry
          </Text>

          <DropDownPicker
            items={this.state.dropdownLocationItems}
            containerStyle={{ height: 45, width: "100%", marginTop: 15 }}
            style={{ backgroundColor: "#fafafa", fontSize: 17 }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => {
              this.setState({
                dropdownSelectedLocationItem: item.value,
              });
            }}
            placeholder={
              this.state.dropdownSelectedLocationItem.length > 0
                ? this.state.dropdownSelectedLocationItem
                : "Please select a location from the drop down"
            }
          />

          <View
            style={[
              this.state.isSubmitButtonEnabled
                ? styles.submitButtonEnabled
                : styles.submitButtonDisabled,
            ]}
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default AddSubCategoryScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  addCategoryBody: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    marginTop: "5%",
  },
  submitButtonEnabled: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2f52a4",
    marginTop: "5%",
    width: "50%",
  },
  submitButtonDisabled: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#898989",
    marginTop: "5%",
    width: "50%",
  },

  input: {
    margin: 15,
    height: 40,
    width: "100%",
    borderColor: "#808080",
    borderWidth: 1,
    marginTop: "5%",
    padding: 10,
    fontSize: 16,
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
    margin: 15,
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
    width: "100%",
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
  deleteIcon: {
    fontSize: 35,
    //color: "#939393",
    color: "red",
  },
  categoryToastMessage: {
    flexDirection: "row",
    justifyContent: "center",
    height: 30,
    width: "100%",
    alignItems: "center",
  },
});
