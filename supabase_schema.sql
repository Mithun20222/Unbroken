
--Tasks table
create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  start_date    date not null default current_date,
  duration_days integer,
  status        text not null default 'active' check (status in ('active','stopped')),
  created_at    timestamptz not null default now()
);

-- Task logs table 
create table if not exists public.task_logs (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks(id) on delete cascade,
  date       date not null,
  completed  boolean not null default true,
  created_at timestamptz not null default now(),
  unique(task_id, date)
);

create index if not exists idx_task_logs_task_id on public.task_logs(task_id);
create index if not exists idx_task_logs_date    on public.task_logs(date);
