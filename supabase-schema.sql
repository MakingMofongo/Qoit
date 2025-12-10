-- Qoit Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create status enum
create type status_mode as enum ('available', 'qoit', 'focused', 'away');

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  title text,
  avatar_url text,
  status status_mode default 'available' not null,
  status_message text,
  back_at timestamptz,
  email_response_time text default '~24h',
  dm_response_time text default '~4h',
  urgent_method text default 'Call',
  personal_note text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  constraint username_format check (username ~* '^[a-z0-9_]+$')
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  sender_name text not null,
  sender_email text not null,
  content text not null,
  is_urgent boolean default false not null,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_profiles_username on public.profiles(username);
create index idx_messages_profile_id on public.messages(profile_id);
create index idx_messages_created_at on public.messages(created_at desc);

-- Row Level Security

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Messages policies
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = profile_id);

create policy "Anyone can send a message"
  on public.messages for insert
  with check (true);

create policy "Users can update their own messages"
  on public.messages for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own messages"
  on public.messages for delete
  using (auth.uid() = profile_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')),
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

