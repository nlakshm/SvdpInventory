import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import React from "react";
import Test from "./apps/Components/Test";
import CategoryScreen from "./apps/screens/CategoryScreen";
import AddCategoryScreen from "./apps/screens/AddCategoryScreen";
import AddSubCategoryScreen from "./apps/screens/AddSubCategoryScreen";
import SubCategoryScreen from "./apps/screens/SubCategoryScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={CategoryScreen} />
        <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
        <Stack.Screen name="SubCategoryScreen" component={SubCategoryScreen} />
        <Stack.Screen
          name="AddSubCategoryScreen"
          component={AddSubCategoryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return <AppNavigation />;
}
