-- Function to create a new profile for a new user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, created_at, updated_at)
  values (new.id, now(), now());
  return new;
end;
$$;

-- Trigger to call the function after a new user is created in the auth.users table.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 