import { View, Text, StyleSheet, Image } from "react-native";
import { Button, ButtonText } from "../../components/Button";
import { router } from "expo-router";

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Swol!</Text>
      <Image
        source={{ uri: "https://picsum.photos/200/300" }}
        style={styles.image}
      />
      <Text style={styles.description}>
        We're so excited you're here! In the next few steps, let's get to know
        more about you!
      </Text>
      <Button
        style={styles.button}
        onPress={() => router.push("/(onboarding)/information")}
      >
        <ButtonText style={styles.buttonText}>Get Started</ButtonText>
      </Button>
    </View>
  );
};

export default Welcome;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333A5D",
  },
  description: {
    fontSize: 18,
    color: "#333A5D",
    textAlign: "center",
    marginHorizontal: 50,
    lineHeight: 24,
  },
  image: {
    width: 200,
    height: 300,
    margin: 20,
  },
  button: {
    margin: 20,
    backgroundColor: "#333A5D",
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
    width: "60%",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
