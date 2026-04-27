create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique,
    display_name text not null default 'Athlete',
    age integer,
    bodyweight numeric,
    level integer not null default 1,
    xp integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.workout_sets (
    id text primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    user_display_name text not null default 'Athlete',
    exercise_id text not null,
    exercise_name text not null,
    muscle text,
    weight numeric not null,
    reps integer not null,
    one_rm numeric,
    ratio numeric,
    xp_earned integer not null default 0,
    rank_tier text,
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workout_sets enable row level security;

drop policy if exists "profiles are private" on public.profiles;
create policy "profiles are private" on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "workouts are private" on public.workout_sets;
create policy "workouts are private" on public.workout_sets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists workout_sets_user_id_created_at_idx on public.workout_sets (user_id, created_at desc);

do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'workout_sets'
          and column_name = 'id'
          and data_type = 'uuid'
    ) then
        alter table public.workout_sets alter column id drop default;
        alter table public.workout_sets alter column id type text using id::text;
    end if;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, email, display_name, age, bodyweight, level, xp)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data ->> 'display_name', 'Athlete'),
        nullif(new.raw_user_meta_data ->> 'age', '')::integer,
        nullif(new.raw_user_meta_data ->> 'bodyweight', '')::numeric,
        coalesce(nullif(new.raw_user_meta_data ->> 'level', '')::integer, 1),
        coalesce(nullif(new.raw_user_meta_data ->> 'xp', '')::integer, 0)
    )
    on conflict (id) do update
    set email = excluded.email,
        display_name = excluded.display_name,
        age = coalesce(excluded.age, public.profiles.age),
        bodyweight = coalesce(excluded.bodyweight, public.profiles.bodyweight),
        level = coalesce(excluded.level, public.profiles.level),
        xp = coalesce(excluded.xp, public.profiles.xp);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
