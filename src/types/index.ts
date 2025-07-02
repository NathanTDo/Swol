export interface UserProfile {
  id: string; // uuid
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  gender?: string;
  fitness_level?: "beginner" | "intermediate" | "advanced";
  fitness_goals?: string[];
  available_equipment?: string[];
  updated_at?: string; // timestamp
  created_at?: string; // timestamp
}

export interface Exercise {
  name: string;
  type: "Strength" | "Cardio" | "Stretching";
  muscle_group: string;
  equipment: string;
  instructions: string;
  video_url?: string;
  sets: number | string;
  reps: number | string;
  duration_seconds?: number;
  rest_between_sets_seconds?: number;
}

export interface DailyWorkout {
  day: number;
  title: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string; // uuid
  user_id: string; // uuid
  user_prompt: string;
  plan_data: {
    daily_workouts: DailyWorkout[];
  };
  created_at: string; // timestamp
}
