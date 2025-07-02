import { useState } from "react";
import { Alert, View, TextInput, Button, Text } from "react-native";
import { supabase } from "../../lib/supabase";
import { Link, router } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (!session) {
      Alert.alert("Success", "Please check your inbox for email verification!");
    } else {
      // Navigate to the dashboard index on successful sign-up
      router.replace("/(dashboard)/");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-6 bg-gray-50">
      <View className="space-y-4">
        <Text className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </Text>
        <TextInput
          className="bg-white p-4 border border-gray-300 rounded-lg text-lg"
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          className="bg-white p-4 border border-gray-300 rounded-lg text-lg"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
        <Button
          title={loading ? "Creating account..." : "Sign Up"}
          onPress={signUpWithEmail}
          disabled={loading}
        />
        <Text className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/(auth)/login" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        </Text>
      </View>
    </View>
  );
}
