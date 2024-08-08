import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import BookList from "./bookList";
import BookForm from "./bookForm";
import SettingsScreen from "./settingsScreen";
import BookDetails from "./bookDetails";
import BookDetail from "./detail";
import MotionDetector from './motionDetector';
import LocationTracking from './map';
import SensorData from "./sensorData";
import { useTheme } from "@/components/ThemeContent";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

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
                name="home-outline"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="Edit"
          component={BookForm}
          options={{
            drawerLabel: "Add/Edit Book",
            title: "Add/Edit Book",
            drawerIcon: () => (
              <Feather
                name="plus-square"
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
                name="info-circle"
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
                name="book-open"
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
            drawerLabel: "Settings",
            title: "Settings",
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
            drawerLabel: "Sensor Data",
            title: "Sensor Data",
            drawerIcon: () => (
              <MaterialIcons
                name="data-usage"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ),
            drawerLabelStyle: { color: theme === "dark" ? "white" : "black" },
          }}
        />
        <Drawer.Screen
          name="Map"
          component={LocationTracking}
          options={{
            drawerLabel: "Map",
            title: "Map",
            drawerIcon: () => (
              <FontAwesome
                name="map"
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
