const { default: CategoryScreen } = require("../screens/CategoryScreen");
const { default: AddCategoryScreen } = require("../screens/AddCategoryScreen");
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    Home: CategoryScreen,
    AddEditCategory: AddCategoryScreen,
  },
  {
    initialRouteName: "Home",
  }
);
export default AppNavigator;
