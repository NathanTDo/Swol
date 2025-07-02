import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
import { UserProfile, WorkoutPlan } from "../../../types";
import { Button, ButtonText } from "../../../components/Button";

export default function Create() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      if (!user) throw new Error("You must be logged in to create a plan.");

      const { data: user_profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<UserProfile>();

      if (!user_profile) {
        throw new Error(
          "Could not fetch your profile. Please complete it before generating a plan."
        );
      }

      const { data, error: functionError } = await supabase.functions.invoke(
        "create-workout-plan",
        { body: { user_prompt: prompt, user_profile } }
      );

      if (functionError) throw functionError;

      const newPlan: WorkoutPlan = {
        id: "",
        user_id: user.id,
        user_prompt: prompt,
        plan_data: data,
        created_at: new Date().toISOString(),
      };

      setPlan(newPlan);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
      Alert.alert("Error", e.message || "Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!plan) return;

    try {
      const { error } = await supabase.from("workout_plans").insert({
        user_id: plan.user_id,
        user_prompt: plan.user_prompt,
        plan_data: plan.plan_data,
      });

      if (error) throw error;

      Alert.alert("Success", "Your workout plan has been saved!");
      setPlan(null);
      setPrompt("");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save the plan.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <Text style={styles.title}>Create Your Workout Plan</Text>

        <View style={styles.promptContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g., A 3-day plan to build muscle at home"
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
          <Pressable
            onPress={generatePlan}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitButton,
              (pressed || loading) && styles.buttonDisabled,
            ]}
          >
            <Ionicons name="arrow-forward-circle" size={44} color="#2563EB" />
          </Pressable>
        </View>

        {loading && <ActivityIndicator size="large" color="#2563EB" />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {plan && (
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>Your New Plan</Text>
            {plan.plan_data.daily_workouts.map((dailyWorkout, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text
                  style={styles.dayTitle}
                >{`Day ${dailyWorkout.day}: ${dailyWorkout.title}`}</Text>
                <View style={styles.exercisesContainer}>
                  {dailyWorkout.exercises.map((exercise, exIndex) => (
                    <View key={exIndex} style={styles.exerciseCard}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.muscle_group} • {exercise.equipment}
                      </Text>
                      <Text style={styles.exerciseInstructions}>
                        {exercise.instructions}
                      </Text>
                      <View style={styles.statsContainer}>
                        <Text style={styles.stat}>
                          <Text style={styles.statLabel}>Sets:</Text>{" "}
                          {exercise.sets}
                        </Text>
                        <Text style={styles.stat}>
                          <Text style={styles.statLabel}>Reps:</Text>{" "}
                          {exercise.reps}
                        </Text>
                        {exercise.duration_seconds && (
                          <Text style={styles.stat}>
                            <Text style={styles.statLabel}>Time:</Text>{" "}
                            {exercise.duration_seconds}s
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            <Button style={styles.button} onPress={savePlan}>
              <ButtonText style={styles.buttonText}>
                Save Plan to History
              </ButtonText>
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3EE" },
  mainContent: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2937" },
  promptContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 20,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  errorText: { color: "red", textAlign: "center" },
  planContainer: {
    gap: 16,
    backgroundColor: "#F4F3EE",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  planTitle: { fontSize: 22, fontWeight: "bold", color: "#1F2937" },
  dayContainer: {
    gap: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
  },
  dayTitle: { fontSize: 20, fontWeight: "600", color: "#374151" },
  exercisesContainer: { gap: 12 },
  exerciseCard: {
    gap: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    padding: 12,
  },
  exerciseName: { fontSize: 18, fontWeight: "bold" },
  exerciseDetails: { textTransform: "capitalize", color: "#6B7280" },
  exerciseInstructions: { color: "#4B5563" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stat: { fontSize: 14 },
  statLabel: { fontWeight: "bold" },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
