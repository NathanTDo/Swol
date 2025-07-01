import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { supabase } from "../../../lib/supabase";

export default function Create() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getResponse = async () => {
    if (!prompt) {
      setError("Prompt cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const { data, error } = await supabase.functions.invoke("hello-openai", {
        body: { prompt },
      });

      if (error) throw error;

      if (data.response) {
        setResponse(data.response);
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask OpenAI</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your prompt"
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Get Response" onPress={getResponse} disabled={loading} />
      {loading && <ActivityIndicator style={styles.loader} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Response:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  responseContainer: {
    marginTop: 20,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  responseText: {
    marginTop: 10,
    fontSize: 16,
  },
});
