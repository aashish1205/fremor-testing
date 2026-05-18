-- Create a table for public user profiles
create table public.user_profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  first_name text,
  last_name text,
  email text,
  phone text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.user_profiles
  for select using (true);

create policy "Users can insert their own profile." on public.user_profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.user_profiles
  for update using (auth.uid() = id);

-- Function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_admin boolean;
begin
  -- Example: auto-assign admin role to a specific email
  -- if new.email = 'admin@fremor.com' then
  --   is_admin := true;
  -- else
  --   is_admin := false;
  -- end if;

  insert into public.user_profiles (id, first_name, last_name, email, phone)
  values (
    new.id,
    -- Handle first name from Google or standard signup
    coalesce(
      new.raw_user_meta_data->>'first_name', 
      split_part(new.raw_user_meta_data->>'full_name', ' ', 1)
    ),
    -- Handle last name from Google or standard signup
    coalesce(
      new.raw_user_meta_data->>'last_name', 
      substring(new.raw_user_meta_data->>'full_name' from position(' ' in new.raw_user_meta_data->>'full_name') + 1)
    ),
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
