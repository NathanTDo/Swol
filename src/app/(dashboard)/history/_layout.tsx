import { Stack } from "expo-router";

export default function HistoryLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#F4F3EE",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "History" }} />
    </Stack>
  );
}
