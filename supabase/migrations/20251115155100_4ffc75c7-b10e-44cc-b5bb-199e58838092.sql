-- Create tasks table for cloud sync
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  text text not null,
  date date not null,
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Create policies for user access
create policy "Users can view their own tasks"
  on public.tasks
  for select
  using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on public.tasks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index tasks_user_id_date_idx on public.tasks(user_id, date);
create index tasks_position_idx on public.tasks(position);

-- Create function to update timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for automatic timestamp updates
create trigger update_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.update_updated_at_column();