import { serve } from "std/http/server.ts";
import { OpenAI } from "openai";
import { UserProfile } from "../../../src/types/index.ts"; // Assuming types are in this path

// CORS headers for browser-based requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `
You are an expert personal trainer AI. Your goal is to create a personalized workout plan for a user based on their profile and request.

You must respond with only a valid JSON object that matches the following structure. Do not include any other text or formatting.

The JSON object should represent a "WorkoutPlan", containing a list of "DailyWorkouts". Each "DailyWorkout" has a day, a title, and a list of "Exercises". Each "Exercise" has a name, type, muscle group, equipment, instructions, and flexible fields for sets, reps, duration, and rest.

Here is an example of the structure you must follow:

{
  "daily_workouts": [
    {
      "day": 1,
      "title": "Full Body Strength",
      "exercises": [
        {
          "name": "Barbell Squat",
          "type": "Strength",
          "muscle_group": "Legs",
          "equipment": "Barbell",
          "instructions": "Keep your back straight and chest up. Squat until your thighs are parallel to the floor.",
          "sets": "3-4",
          "reps": "8-12",
          "rest_between_sets_seconds": 90
        },
        {
          "name": "Plank",
          "type": "Strength",
          "muscle_group": "Core",
          "equipment": "Bodyweight",
          "instructions": "Hold a straight line from your head to your heels. Engage your core.",
          "sets": 3,
          "duration_seconds": 60,
          "rest_between_sets_seconds": 45
        }
      ]
    }
  ]
}
`;

serve(async (req: Request) => {
  // Handle preflight requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize OpenAI client with the secret key
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // Get the 'prompt' from the request body
    const {
      user_prompt,
      user_profile,
    }: { user_prompt: string; user_profile: UserProfile } = await req.json();

    const userProfileInfo = `
      - Age: ${user_profile.age}
      - Weight: ${user_profile.weight_kg} kg
      - Height: ${user_profile.height_cm} cm
      - Gender: ${user_profile.gender}
      - Fitness Level: ${user_profile.fitness_level}
      - Goals: ${user_profile.fitness_goals?.join(", ")}
      - Available Equipment: ${user_profile.available_equipment?.join(", ")}
    `;

    const fullPrompt = `
      Here is the user's profile:
      ${userProfileInfo}

      Here is the user's request:
      "${user_prompt}"

      Generate a workout plan based on this information, following the required JSON format.
    `;

    // Call the OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: fullPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const responseData = chatCompletion.choices[0].message.content;

    if (!responseData) {
      throw new Error("No response data from OpenAI.");
    }

    // The response should be a JSON string, so we parse it.
    const planData = JSON.parse(responseData);

    // Return the AI's response
    return new Response(JSON.stringify(planData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal Server Error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
