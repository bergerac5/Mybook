import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import BookList from "./bookList";
import BookForm from "./bookForm"; // Ensure correct import
import SettingsScreen from "./settingsScreen";
import BookDetails from "./bookDetails";
import BookDetail from "./detail";
import MotionDetector from './motionDetector'
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MyMap from './map'


import { useTheme } from "@/components/ThemeContent";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import SensorData from "./sensorData";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { theme } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const Layout = () => {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme === "dark" ? "black" : "white" }}
    >
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={BookList}
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => (
              <Ionicons
                name="home"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="Edit"
          component={BookForm} // Ensure correct component assignment
          options={{
            drawerLabel: "Add/Edit Book",
            title: "Add/Edit Book",
            drawerIcon: () => (
              <Feather
                name="edit"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="Detail"
          component={BookDetails}
          options={{
            drawerLabel: "Details",
            title: "Details",
            drawerIcon: () => (
              <FontAwesome
                name="book"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="BookDetail"
          component={BookDetail}
          options={{
            drawerLabel: "Book Details",
            title: "Book Details",
            drawerIcon: () => (
              <FontAwesome5
                name="book-reader"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
            drawerItemStyle: { display: "none" }, // Hides the item from the drawer menu
          }}
        />
        <Drawer.Screen
          name="Setting"
          component={SettingsScreen}
          options={{
            drawerLabel: "Setting",
            title: "Setting",
            drawerIcon: () => (
              <AntDesign
                name="setting"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="DataDisplay"
          component={SensorData}
          options={{
            drawerLabel: "DataDisplay",
            title: "DataDisplay",
            drawerIcon: () => (
              <MaterialIcons name="auto-awesome-motion"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="map"
          component={MyMap}
          options={{
            drawerLabel: "Map",
            title: "Map",
            drawerIcon: () => (
              <FontAwesome name="map-marker"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

export default Layout;
