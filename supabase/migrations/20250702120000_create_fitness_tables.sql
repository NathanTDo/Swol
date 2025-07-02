-- Create the profiles table to store user-specific information
create table profiles (
  id uuid primary key references auth.users(id) not null,
  age smallint,
  weight_kg real,
  height_cm real,
  gender text,
  fitness_level text check (fitness_level in ('beginner', 'intermediate', 'advanced')),
  fitness_goals text[],
  available_equipment text[],
  updated_at timestamp with time zone,
  created_at timestamp with time zone default now() not null
);

-- Add comments to the columns for clarity
comment on column profiles.age is 'Age of the user';
comment on column profiles.weight_kg is 'Weight of the user in kilograms';
comment on column profiles.height_cm is 'Height of the user in centimeters';
comment on column profiles.gender is 'Gender of the user';
comment on column profiles.fitness_level is 'Fitness level of the user';
comment on column profiles.fitness_goals is 'Fitness goals of the user';
comment on column profiles.available_equipment is 'Equipment available to the user';

-- Enable Row Level Security for the profiles table
alter table profiles enable row level security;

-- Policies for profiles table
create policy "Users can view their own profile." on profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);


-- Create the workout_plans table to store generated workout plans
create table workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  user_prompt text not null,
  plan_data jsonb not null,
  created_at timestamp with time zone default now() not null
);

-- Add comments to the columns for clarity
comment on column workout_plans.user_id is 'The user who this workout plan belongs to.';
comment on column workout_plans.user_prompt is 'The prompt the user submitted to generate the plan.';
comment on column workout_plans.plan_data is 'The generated workout plan data.';

-- Enable Row Level Security for the workout_plans table
alter table workout_plans enable row level security;

-- Policies for workout_plans table
create policy "Users can view their own workout plans." on workout_plans for select using (auth.uid() = user_id);
create policy "Users can create workout plans." on workout_plans for insert with check (auth.uid() = user_id);
create policy "Users can delete their own workout plans." on workout_plans for delete using (auth.uid() = user_id); 