-- Create co_travellers table linked to user profiles
create table public.co_travellers (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references public.user_profiles(id) on delete cascade,
    first_name text,
    last_name text,
    gender text,
    date_of_birth date,
    nationality text,
    relationship text,
    meal_preference text,
    train_berth_preference text,
    passport_no text,
    passport_expiry date,
    passport_issuing_country text,
    mobile text,
    email text,
    airline text,
    frequent_flyer_number text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.co_travellers enable row level security;

-- Policies: users can only manage their own co-travellers
create policy "Users can view own co-travellers" on public.co_travellers
    for select using (auth.uid() = user_id);

create policy "Users can insert own co-travellers" on public.co_travellers
    for insert with check (auth.uid() = user_id);

create policy "Users can update own co-travellers" on public.co_travellers
    for update using (auth.uid() = user_id);

create policy "Users can delete own co-travellers" on public.co_travellers
    for delete using (auth.uid() = user_id);
