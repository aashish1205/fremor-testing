-- Add new columns to user_profiles to support the My Profile UI

alter table public.user_profiles
add column if not exists gender text,
add column if not exists date_of_birth date,
add column if not exists nationality text,
add column if not exists marital_status text,
add column if not exists anniversary date,
add column if not exists city_of_residence text,
add column if not exists state text,
add column if not exists passport_no text,
add column if not exists passport_expiry date,
add column if not exists passport_issuing_country text,
add column if not exists pan_card_number text;
