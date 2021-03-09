import React from "react";
import categoryComponent from "../Components/CategoryComponent";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class CategoryScreen extends React.Component {
  state = {
    categories: {},
    message: "",
    isError: false,
  };

  componentDidMount = () => {
    this.mounted = true;
    categoryComponent.fetchData(this);
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleToast = (data) => {
    //Toast.show(data, Toast.LONG);
  };

  buildCategoryListItem = (category) => {
    return (
      <View key={category.id} style={styles.categoryComponentWrapper}>
        <View style={styles.categoryPictureWrapper}>
          <Image
            source={{ uri: category.downloadURL }}
            //source={require("./assets/leafy.png")}
            style={styles.categoryPicture}
          />
        </View>
        <View style={styles.categoryDetailsWrapper}>
          <View style={{ height: "70%" }}>
            <Text style={styles.categoryDetailsNameText} numberOfLines={1}>
              {category.name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.categoryDetailsQuantityText}>
                Total Quantity
              </Text>
              <Text
                style={[
                  category.totalQuantity <= 0
                    ? styles.categoryDetailsQuanityUnitWarningText
                    : styles.categoryDetailsQuanityUnitText,
                ]}
              >
                {category.totalQuantity} lbs
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              height: "30%",
            }}
          >
            <Icon
              name="edit"
              onPress={() =>
                this.props.navigation.navigate("AddCategoryScreen", {
                  data: category,
                  operation: "edit",
                })
              }
              style={styles.categoryDetailsIcon}
            />

            <Icon
              name="times-circle"
              onPress={() => {
                console.log(category.id);
                Alert.alert(
                  "Delete Category",
                  "Are you sure you want to delete ?",
                  [
                    {
                      text: "Yes",
                      onPress: () => categoryComponent.delete(category, this),
                    },
                    { text: "No" },
                  ]
                );
              }}
              style={styles.categoryDetailsIcon}
            />

            <Icon
              name="arrow-circle-right"
              onPress={() =>
                this.props.navigation.navigate("SubCategoryScreen", {
                  data: category,
                })
              }
              style={styles.categoryDetailsIcon}
            />
          </View>
          <Text style={styles.categoryLastUpdatedTime}>
            {" " +
              categoryComponent.getLastUpdatedTime(
                category.lastUpdatedTime
              )}{" "}
          </Text>
        </View>
      </View>
    );
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
          {this.state.message}
        </Text>
      </View>
    );
  };

  buildCategoryList = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
        {Object.keys(this.state.categories).map((key) =>
          this.buildCategoryListItem(this.state.categories[key])
        )}
      </ScrollView>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.categoryScreenWrapper}>
        <View style={styles.categoryHeaderWrapper}>
          <View style={styles.categoryHeaderTextWrapper}>
            <Text style={styles.categoryHeaderText}>Categories</Text>
          </View>

          <View style={styles.categoryHeaderIconWrapper}>
            <Icon
              name="refresh"
              onPress={() => {
                categoryComponent.fetchData(this);
              }}
              style={styles.categoryHeaderIcon}
            />

            <Icon name="filter" style={styles.categoryHeaderIcon} />
            <Icon
              name="plus"
              onPress={() =>
                this.props.navigation.navigate("AddCategoryScreen", {
                  operation: "add",
                })
              }
              style={styles.categoryHeaderIcon}
            />
          </View>
        </View>

        {this.state.message.length > 0
          ? this.buildToastMessage()
          : console.log("no message")}
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            width: "90%",
            marginTop: 10,
            borderRadius: 10,
          }}
          onChangeText={(text) => onChangeText(text)}
        />
        {this.buildCategoryList()}
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

  categoryHeaderWrapper: {
    color: "white",
    backgroundColor: "#EF6465",
    width: "90%",
    height: "6%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  categoryHeaderTextWrapper: {
    width: "60%",
  },

  categoryHeaderText: {
    fontFamily: "AppleSDGothicNeo-Regular",
    fontSize: 25,
    color: "white",
    fontWeight: "700",
    marginLeft: 10,
  },

  categoryHeaderIconWrapper: {
    width: "40%",
    flexDirection: "row",
    justifyContent: "space-around",
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
  categoryToastMessage: {
    flexDirection: "row",
    justifyContent: "center",
    height: 30,
    width: "90%",
    alignItems: "center",
  },
});
export default CategoryScreen;
