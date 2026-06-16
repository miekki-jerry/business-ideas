# Business Ideas Knowledge Base

Source-backed business idea search engine and MCP server.

## Stack

- Cloudflare Workers
- D1 for lightweight catalog rows
- R2 for canonical JSON/markdown/source data
- Cloudflare AI Search for retrieval and MCP V1
- TypeScript, Hono, Zod, Vitest

## Local Development

```bash
pnpm install
cp .dev.vars.example .dev.vars
cp wrangler.example.toml wrangler.toml
pnpm test
pnpm dev
```

Open:

```text
http://localhost:8787/api/business-ideas/health
```

The Worker falls back to sample data when Cloudflare bindings are not configured.

## Scripts

```bash
pnpm seed
pnpm import:hubspot
pnpm import:mfm
pnpm index:ai-search
pnpm index:source-candidates
pnpm rebuild:search
```

Import scripts write raw/source snapshots under `.private/`. Do not commit that directory.

`pnpm index:source-candidates` writes verified source-candidate markdown docs from `.private/agent-source-research/candidates.json` into `.private/ai-search-source-candidates`. Upload those docs to `business-ideas-search/source-candidates/` and run an AI Search sync job when you want Cloudflare AI Search to know about the research queue.

## Cloudflare Setup

1. Copy `wrangler.example.toml` to `wrangler.toml`.
2. Fill in your D1 `database_id` and any deployment-specific names.
3. D1 database `business-ideas` is the default catalog database name.
4. R2 bucket `business-ideas` is the default canonical JSON/source storage bucket.
5. R2 bucket `business-ideas-search` stores AI Search markdown documents only.
6. AI Search instance `business-ideas-search` is configured through the `BUSINESS_IDEAS_SEARCH` Worker binding.
7. Apply migrations:

```bash
wrangler d1 migrations apply business-ideas --local
wrangler d1 migrations apply business-ideas --remote
```

8. Build the private catalog from imported source snapshots:

```bash
pnpm build:catalog
```

9. Deploy:

```bash
pnpm deploy
```

## MCP

The Worker exposes `/mcp` with compact typed tools. See [docs/mcp-connection.md](docs/mcp-connection.md) for Claude Code and Codex setup commands.

See [docs/business-ideas-architecture.md](docs/business-ideas-architecture.md).
