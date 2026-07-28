create table if not exists agent_workflows (
  id text primary key,
  slug text not null unique,
  category text not null,
  department text not null,
  difficulty text not null,
  maturity text not null,
  published integer not null default 0 check (published in (0, 1)),
  content_json text not null,
  updated_at text not null
);

create index if not exists idx_agent_workflows_published_category
  on agent_workflows(published, category);
create index if not exists idx_agent_workflows_published_department
  on agent_workflows(published, department);
create index if not exists idx_agent_workflows_published_difficulty
  on agent_workflows(published, difficulty);
create index if not exists idx_agent_workflows_published_maturity
  on agent_workflows(published, maturity);
