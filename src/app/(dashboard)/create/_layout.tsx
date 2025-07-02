import { Stack } from "expo-router";

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#F4F3EE",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Create", headerShown: false }}
      />
    </Stack>
  );
}
