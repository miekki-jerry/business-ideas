# Business Ideas Knowledge Base Architecture

## Purpose

This project stores source-backed business ideas for a public website, internal knowledge base, or MCP-accessible agent workflow.

It is not an AI-generated idea generator. The default behavior is retrieval first, then optional explanation. Every recommendation should point back to source evidence.

## Storage

- R2 `business-ideas` is canonical storage for full JSON documents, source items, transcripts, chunks and import jobs.
- R2 `business-ideas-search` stores rebuildable AI Search markdown documents only.
- D1 is a lightweight public catalog and lookup layer.
- Cloudflare AI Search is a rebuildable retrieval index.

R2 object layout:

```text
/sources/{sourceId}.json
/source-items/{sourceItemId}.json
/transcripts/{sourceItemId}.json
/chunks/{sourceItemId}/{chunkId}.json
/ideas/{ideaId}.json
/import-jobs/{jobId}.json
```

AI Search object layout:

```text
/ideas/{ideaId}.md
```

AI Search documents must stay small and live in `business-ideas-search`. Use `1 idea = 1 file` and `1 chunk = 1 file` when chunk search is added. Do not upload JSON source snapshots, full podcast archives, or source-research candidates to the search bucket.

Source candidates are for research and ingestion planning. Keep them private until transcripts/content are extracted, reviewed, and promoted into public `business_idea` records.

## Public API

```text
GET  /api/business-ideas/health
GET  /api/business-ideas/random
GET  /api/business-ideas/ideas/:id
GET  /api/business-ideas/ideas/slug/:slug
POST /api/business-ideas/search
POST /api/business-ideas/recommend
GET  /api/business-ideas/ideas/:id/evidence
GET  /api/business-ideas/ideas/:id/similar
GET  /api/business-ideas/sources
GET  /api/business-ideas/sources/:id
POST /mcp
```

## MCP

The Worker exposes a compact read-only MCP `/mcp` endpoint for typed tools, resources, and prompts:

- `search_business_ideas`
- `count_business_ideas`
- `list_business_ideas`
- `get_business_idea`
- `recommend_business_ideas`
- `get_random_business_ideas`
- `get_idea_evidence`
- `get_business_idea_facets`
- `find_similar_business_ideas`
- `list_sources`

Resources:

- `business-ideas://overview`
- `business-ideas://facets`

Resource templates:

- `business-ideas://idea/{id-or-slug}`

Prompts:

- `recommend_for_builder_profile`
- `compare_business_ideas`
- `validation_brief`

Tool and resource responses are intentionally compact and include `hints` or `recoveryHints` when helpful. They do not return full transcripts.

Example:

```bash
curl -X POST http://localhost:8787/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_business_ideas","arguments":{"query":"solo B2B AI low capital","limit":3}}}'
```

## Environment

```text
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
DEFAULT_AI_PROVIDER=openai
DEFAULT_AI_MODEL=gpt-5-mini
```

Worker bindings:

```text
BUSINESS_IDEAS_DB
BUSINESS_IDEAS_BUCKET
BUSINESS_IDEAS_SEARCH
```

Without D1/R2 and AI Search bindings, the Worker uses committed sample data and local search. This is for local development and tests only.

## Copyright Rules

Do not commit full copyrighted transcripts, copied article bodies, or full podcast transcript dumps.

The public repo can include:

- application code
- schema and scripts
- docs
- tiny synthetic/sample data
- source links and short quotes

Private/generated data belongs in R2 or `.private/`, which is gitignored.
