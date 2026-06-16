# Business Ideas Knowledge Base

Source-backed business idea search engine for `bogumilluc.pl/lab/business-ideas`.

## Stack

- Cloudflare Workers
- D1 for lightweight catalog rows
- R2 for canonical JSON/markdown/source data
- Cloudflare AI Search for retrieval and MCP V1
- TypeScript, Hono, Zod, Vitest

## Local Development

```bash
pnpm install
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

1. D1 database `business-ideas` is configured in `wrangler.toml`.
2. R2 bucket `business-ideas` is configured in `wrangler.toml` as canonical JSON/source storage.
3. R2 bucket `business-ideas-search` stores AI Search markdown documents only.
4. AI Search instance `business-ideas-search` is configured through the `BUSINESS_IDEAS_SEARCH` Worker binding.
5. Apply migrations:

```bash
wrangler d1 migrations apply business-ideas --local
wrangler d1 migrations apply business-ideas --remote
```

6. Build the private catalog from imported source snapshots:

```bash
pnpm build:catalog
```

7. Deploy:

```bash
pnpm deploy
```

## MCP

The Worker exposes `/mcp` with compact typed tools. See [docs/mcp-connection.md](docs/mcp-connection.md) for Claude Code and Codex setup commands.

See [docs/business-ideas-architecture.md](docs/business-ideas-architecture.md).
