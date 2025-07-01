import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#F4F3EE",
        },
      }}
    >
      <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
    </Stack>
  );
}
