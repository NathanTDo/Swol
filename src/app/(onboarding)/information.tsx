import { View, Text, StyleSheet, StatusBar } from "react-native";

const Information = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Swol</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.content}>
        <Text style={styles.title}>Let's Get To Know You!</Text>
      </View>
    </View>
  );
};

export default Information;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333A5D",
  },
  header: {
    height: 70,
    marginTop: 48,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#333A5D",
    marginLeft: 24,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#D1D5DB",
  },
});
