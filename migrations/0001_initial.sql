create table if not exists sources (
  id text primary key,
  type text not null,
  name text not null,
  url text,
  author text,
  description text,
  created_at text not null,
  updated_at text not null
);

create table if not exists source_items (
  id text primary key,
  source_id text not null,
  title text not null,
  url text not null,
  external_id text,
  published_at text,
  duration_sec integer,
  language text default 'en',
  r2_key text,
  raw_metadata_json text,
  created_at text not null,
  updated_at text not null,
  foreign key (source_id) references sources(id)
);

create table if not exists business_ideas (
  id text primary key,
  slug text not null unique,
  title text not null,
  one_liner text not null,
  primary_industry text,
  primary_business_model text,
  capital_required text,
  difficulty text,
  time_to_revenue text,
  solo_founder_fit integer,
  ai_leverage integer,
  b2b_fit integer,
  boring_business_score integer,
  competition_level text,
  geography text,
  r2_json_key text not null,
  r2_markdown_key text,
  source_confidence real default 0.7,
  created_at text not null,
  updated_at text not null
);

create table if not exists idea_evidence (
  id text primary key,
  idea_id text not null,
  source_id text,
  source_item_id text,
  chunk_id text,
  source_title text,
  source_url text,
  start_sec integer,
  end_sec integer,
  url_at_timestamp text,
  quote text,
  relevance_score real,
  r2_chunk_key text,
  created_at text not null,
  foreign key (idea_id) references business_ideas(id),
  foreign key (source_id) references sources(id),
  foreign key (source_item_id) references source_items(id)
);

create table if not exists import_jobs (
  id text primary key,
  source_type text not null,
  source_url text,
  status text not null,
  error_message text,
  metadata_json text,
  created_at text not null,
  updated_at text not null
);

create index if not exists idx_business_ideas_slug on business_ideas(slug);
create index if not exists idx_business_ideas_industry on business_ideas(primary_industry);
create index if not exists idx_business_ideas_model on business_ideas(primary_business_model);
create index if not exists idx_business_ideas_capital on business_ideas(capital_required);
create index if not exists idx_business_ideas_difficulty on business_ideas(difficulty);
create index if not exists idx_business_ideas_solo on business_ideas(solo_founder_fit);
create index if not exists idx_business_ideas_ai on business_ideas(ai_leverage);
create index if not exists idx_business_ideas_b2b on business_ideas(b2b_fit);
create index if not exists idx_idea_evidence_idea_id on idea_evidence(idea_id);
