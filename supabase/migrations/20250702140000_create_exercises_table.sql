-- Create the exercises table to store a master list of available exercises.
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('Strength', 'Cardio', 'Stretching')),
  muscle_group text not null,
  equipment text not null,
  instructions text,
  video_url text,
  created_at timestamp with time zone default now() not null
);

-- Add comments for clarity
comment on table exercises is 'Master list of all exercises available in the app.';
comment on column exercises.name is 'The name of the exercise.';
comment on column exercises.type is 'The category of the exercise (e.g., Strength, Cardio).';
comment on column exercises.muscle_group is 'The primary muscle group targeted by the exercise.';
comment on column exercises.equipment is 'The equipment required for the exercise.';
comment on column exercises.instructions is 'Instructions on how to perform the exercise.';
comment on column exercises.video_url is 'A URL to a video demonstration of the exercise.';

-- Enable Row Level Security for the exercises table
alter table exercises enable row level security;

-- Policies for exercises table: Allow public read access
create policy "Users can view all exercises." on exercises for select using (true);


-- Pre-populate the table with some common exercises
insert into exercises (name, type, muscle_group, equipment, instructions) values
('Barbell Squat', 'Strength', 'Legs', 'Barbell', 'Keep your back straight and chest up. Squat until your thighs are parallel to the floor.'),
('Bench Press', 'Strength', 'Chest', 'Barbell', 'Lie on a flat bench, lower the bar to your mid-chest, and press it back up until your arms are fully extended.'),
('Deadlift', 'Strength', 'Back', 'Barbell', 'Start with the bar on the floor. Hinge at your hips and knees to lift the bar, keeping your back straight.'),
('Overhead Press', 'Strength', 'Shoulders', 'Barbell', 'Press the barbell overhead from your shoulders until your arms are fully extended.'),
('Pull Up', 'Strength', 'Back', 'Pull-up Bar', 'Hang from the bar with an overhand grip. Pull your body up until your chin is over the bar.'),
('Push Up', 'Strength', 'Chest', 'Bodyweight', 'Start in a plank position. Lower your body until your chest nearly touches the floor, then push back up.'),
('Plank', 'Strength', 'Core', 'Bodyweight', 'Hold a straight line from your head to your heels. Engage your core and glutes.'),
('Running', 'Cardio', 'Legs', 'Bodyweight', 'Run at a steady pace on a treadmill or outdoors.'),
('Jumping Jacks', 'Cardio', 'Full Body', 'Bodyweight', 'Jump while spreading your legs and bringing your arms overhead, then return to the starting position.'); 