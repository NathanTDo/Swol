import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { UserProfile } from "../../../types";
import { useAuth } from "../../../providers/AuthProvider"; // Assuming you have an AuthProvider

// Mock data for selectors - in a real app, this might come from a config file
const fitnessLevels = ["beginner", "intermediate", "advanced"];
const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
const fitnessGoals = [
  "Lose Weight",
  "Build Muscle",
  "Improve Endurance",
  "Increase Flexibility",
];
const equipmentOptions = [
  "Full Gym",
  "Dumbbells Only",
  "Bodyweight",
  "Kettlebells",
  "Resistance Bands",
];

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: undefined,
    weight_kg: undefined,
    height_cm: undefined,
    gender: undefined,
    fitness_level: "beginner",
    fitness_goals: [],
    available_equipment: [],
  });

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile({
          ...data,
          age: data.age || undefined,
          weight_kg: data.weight_kg || undefined,
          height_cm: data.height_cm || undefined,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Helper to toggle array items for goals and equipment
  const toggleSelection = (
    field: "fitness_goals" | "available_equipment",
    value: string
  ) => {
    const currentSelection = profile[field] || [];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter((item) => item !== value)
      : [...currentSelection, value];
    setProfile({ ...profile, [field]: newSelection });
  };

  return (
    <ScrollView className="flex-1 p-6 bg-gray-50">
      <View className="space-y-4 mb-6">
        <Text className="text-2xl font-bold text-gray-800">Your Profile</Text>
        <Text className="text-gray-600">
          This information helps in creating a personalized workout plan for
          you.
        </Text>

        {/* --- Personal Details --- */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-gray-700">
            Personal Details
          </Text>
          <TextInput
            className="bg-white p-3 border border-gray-300 rounded-md"
            placeholder="Age"
            keyboardType="numeric"
            value={profile.age ? String(profile.age) : ""}
            onChangeText={(text) =>
              setProfile({ ...profile, age: Number(text) || undefined })
            }
          />
          <TextInput
            className="bg-white p-3 border border-gray-300 rounded-md"
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={profile.weight_kg ? String(profile.weight_kg) : ""}
            onChangeText={(text) =>
              setProfile({ ...profile, weight_kg: Number(text) || undefined })
            }
          />
          <TextInput
            className="bg-white p-3 border border-gray-300 rounded-md"
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={profile.height_cm ? String(profile.height_cm) : ""}
            onChangeText={(text) =>
              setProfile({ ...profile, height_cm: Number(text) || undefined })
            }
          />
        </View>

        {/* --- Fitness Level --- */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-gray-700">
            Fitness Level
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {fitnessLevels.map((level) => (
              <Text
                key={level}
                onPress={() =>
                  setProfile({ ...profile, fitness_level: level as any })
                }
                className={`px-4 py-2 rounded-full capitalize ${profile.fitness_level === level ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {level}
              </Text>
            ))}
          </View>
        </View>

        {/* --- Fitness Goals --- */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-gray-700">
            Fitness Goals (select multiple)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {fitnessGoals.map((goal) => (
              <Text
                key={goal}
                onPress={() => toggleSelection("fitness_goals", goal)}
                className={`px-4 py-2 rounded-full ${profile.fitness_goals?.includes(goal) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {goal}
              </Text>
            ))}
          </View>
        </View>

        {/* --- Available Equipment --- */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-gray-700">
            Available Equipment (select multiple)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {equipmentOptions.map((equipment) => (
              <Text
                key={equipment}
                onPress={() =>
                  toggleSelection("available_equipment", equipment)
                }
                className={`px-4 py-2 rounded-full ${profile.available_equipment?.includes(equipment) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {equipment}
              </Text>
            ))}
          </View>
        </View>

        <Button
          title={loading ? "Saving..." : "Save Profile"}
          onPress={updateProfile}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}
