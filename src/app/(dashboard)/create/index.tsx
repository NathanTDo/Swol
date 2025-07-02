import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
import { UserProfile, WorkoutPlan } from "../../../types";

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
      // 1. Fetch the user's profile for personalization
      if (!user) throw new Error("You must be logged in to create a plan.");

      const { data: user_profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<UserProfile>();

      if (profileError || !user_profile) {
        throw new Error(
          "Could not fetch your profile. Please complete it before generating a plan."
        );
      }

      // 2. Call the new edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        "create-workout-plan",
        {
          body: { user_prompt: prompt, user_profile },
        }
      );

      if (functionError) throw functionError;

      // The function returns the plan_data part of the WorkoutPlan
      const newPlan: WorkoutPlan = {
        id: "", // Will be generated on save
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

      Alert.alert(
        "Success",
        "Your workout plan has been saved to your history!"
      );
      setPlan(null); // Clear the plan after saving
      setPrompt("");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save the plan.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="space-y-6">
        <Text className="text-3xl font-bold text-gray-800">
          Create Your Workout Plan
        </Text>

        <TextInput
          className="bg-white p-4 border border-gray-300 rounded-lg text-lg"
          placeholder="e.g., A 3-day plan to build muscle at home"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />

        <TouchableOpacity
          className={`py-3 px-4 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
          onPress={generatePlan}
          disabled={loading}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Generating Your Plan..." : "Generate Plan"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color="#3B82F6" className="my-4" />
        )}
        {error && <Text className="text-red-500 text-center">{error}</Text>}

        {plan && (
          <View className="mt-6 space-y-4 bg-white p-4 rounded-lg shadow-md">
            <Text className="text-2xl font-bold text-gray-800">
              Your New Plan
            </Text>
            {plan.plan_data.daily_workouts.map((dailyWorkout, index) => (
              <View
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <Text className="text-xl font-semibold text-gray-700">{`Day ${dailyWorkout.day}: ${dailyWorkout.title}`}</Text>
                <View className="mt-2 space-y-2">
                  {dailyWorkout.exercises.map((exercise, exIndex) => (
                    <View key={exIndex} className="p-3 bg-gray-50 rounded-md">
                      <Text className="text-lg font-bold">{exercise.name}</Text>
                      <Text className="capitalize text-gray-600">
                        {exercise.muscle_group} • {exercise.equipment}
                      </Text>
                      <Text className="mt-1 text-gray-500">
                        {exercise.instructions}
                      </Text>
                      <View className="flex-row justify-between mt-2">
                        <Text>
                          <Text className="font-bold">Sets:</Text>{" "}
                          {exercise.sets}
                        </Text>
                        <Text>
                          <Text className="font-bold">Reps:</Text>{" "}
                          {exercise.reps}
                        </Text>
                        {exercise.duration_seconds && (
                          <Text>
                            <Text className="font-bold">Time:</Text>{" "}
                            {exercise.duration_seconds}s
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            <Button title="Save Plan to History" onPress={savePlan} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
