create unique index if not exists idx_source_items_source_external
  on source_items(source_id, external_id)
  where external_id is not null;
