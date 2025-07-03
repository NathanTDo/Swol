import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { UserProfile } from "../../../types";
import { useAuth } from "../../../providers/AuthProvider"; // Assuming you have an AuthProvider
import { Checkbox } from "../../../components/Checkbox";
import { Label } from "../../../components/Label";

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
        <Text style={styles.header}>Your Profile</Text>

        {/* --- Personal Details --- */}
        <View className="space-y-2">
          <Text style={styles.title}>Personal Details</Text>
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
          <Text style={styles.title}>Fitness Level</Text>
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
          <Text style={styles.title}>Fitness Goals (select multiple)</Text>
          <View className="gap-2">
            {fitnessGoals.map((goal) => (
              <Label
                key={goal}
                className="flex-row items-center gap-2"
                onPress={() => toggleSelection("fitness_goals", goal)}
              >
                <Checkbox
                  id={goal}
                  checked={!!profile.fitness_goals?.includes(goal)}
                  onCheckedChange={() => {}} // Press is handled by Label
                />
                <Text className="text-lg">{goal}</Text>
              </Label>
            ))}
          </View>
        </View>

        {/* --- Available Equipment --- */}
        <View className="space-y-2">
          <Text style={styles.title}>
            Available Equipment (select multiple)
          </Text>
          <View className="gap-2">
            {equipmentOptions.map((equipment) => (
              <Label
                key={equipment}
                className="flex-row items-center gap-2"
                onPress={() =>
                  toggleSelection("available_equipment", equipment)
                }
              >
                <Checkbox
                  id={equipment}
                  checked={!!profile.available_equipment?.includes(equipment)}
                  onCheckedChange={() => {}} // Press is handled by Label
                />
                <Text className="text-lg">{equipment}</Text>
              </Label>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F3EE" },
  mainContent: {
    padding: 24,
    gap: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
});
