import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const TabsLayout = () => {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for the auth state to be determined
    if (!session) {
      // Redirect to the login page if the user is not authenticated
      router.replace("/(auth)/login");
    }
  }, [session, loading]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener in AuthProvider will handle the redirect
  };

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
            headerRight: () => (
              <Button
                onPress={handleSignOut}
                title="Sign Out"
                color="#495867"
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;
