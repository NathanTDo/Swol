import { useState } from "react";
import { Alert, View, Text, StyleSheet, Pressable } from "react-native";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { Input } from "../../components/Input";
import { Button, ButtonText } from "../../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      // Navigate to the dashboard index on successful login
      router.replace("/(dashboard)/");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Welcome Back</Text>
        <Input
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
        <Button
          style={[styles.button, loading && styles.disabled]}
          onPress={signInWithEmail}
          disabled={loading}
        >
          <ButtonText style={styles.buttonText}>
            {loading ? "Signing in..." : "Sign In"}
          </ButtonText>
        </Button>
        <View style={styles.linkContainer}>
          <Text>No Account Yet? </Text>
          <Pressable onPress={() => router.replace("/(auth)/signup")}>
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  wrapper: {
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F2937",
  },
  input: {
    backgroundColor: "white",
    fontSize: 16,
    padding: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    color: "#4B5563",
    marginTop: 16,
  },
  link: {
    color: "#2563EB",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
