import { StyleSheet, Text, View, SafeAreaView } from "react-native";

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>This is dashboard page</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F3EE",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#fff",
  },
});
