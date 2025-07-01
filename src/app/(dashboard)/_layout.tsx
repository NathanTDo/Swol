import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

const TabsLayout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F4F3EE" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F4F3EE",
          tabBarInactiveTintColor: "#BCB8B1",
          tabBarStyle: {
            backgroundColor: "#495867",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;
