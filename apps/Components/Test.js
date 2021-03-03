import React from "react";
import { Gyroscope, Accelerometer } from "expo-sensors";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
export default class Test extends React.Component {
  state = {
    gyroscope: { x: 0, y: 0, z: 0 },
    accelerometer: { x: 0, y: 0, z: 0 },
    message: "",
    imageURI: "",
  };

  componentDidMount = () => {
    console.log("Component did mount");
    Gyroscope.setUpdateInterval(1500);
    Gyroscope.addListener((gyroscopeData) => {
      this.setState({ gyroscope: gyroscopeData });
    });

    Accelerometer.setUpdateInterval(500);
    Accelerometer.addListener((gyroscopeData) => {
      let cmessage = this.getPositionResult(gyroscopeData);

      this.setState({
        accelerometer: gyroscopeData,
        message: cmessage,
      });
    });
  };

  round = (n) => {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  };

  getPositionResult = (data) => {
    if (data.x > 0.2) {
      return "tilt left";
    } else if (data.x < -0.2) {
      return "tilt right";
    } else if (data.y > -0.9 || data.y < -1.0) {
      return "Please keep the phone straight along y axis";
    } else if (data.z < -0.22 || data.z > 0.1) {
      return "Please keep the phone straight along z axis";
    }
    return "correct";
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

  render() {
    return (
      <SafeAreaView style={styles.sensorReadings}>
        <View style={{ flexDirection: "column" }}>
          <Text>x</Text>
          <Text>{this.round(this.state.gyroscope.x)}</Text>
          <Text>y</Text>
          <Text>{this.round(this.state.gyroscope.y)}</Text>
          <Text>z</Text>
          <Text>{this.round(this.state.gyroscope.z)}</Text>
          <Text>Gyroscope</Text>
        </View>
        <View style={{ flexDirection: "column", marginTop: 50 }}>
          <Text>x</Text>
          <Text>{this.round(this.state.accelerometer.x)}</Text>
          <Text>y</Text>
          <Text>{this.round(this.state.accelerometer.y)}</Text>
          <Text>z</Text>
          <Text>{this.round(this.state.accelerometer.z)}</Text>
          <Text>Accelerometer</Text>
        </View>
        <Text>{this.state.message}</Text>
        <View style={{ marginTop: 50 }}>
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
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  sensorReadings: {
    flexDirection: "column",

    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 100,
    //color: "#939393",
    color: "#808080",
    marginTop: "5%",
  },
});
