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
pnpm rebuild:search
```

Import scripts write raw/source snapshots under `.private/`. Do not commit that directory.

## Cloudflare Setup

1. Create a D1 database and replace `database_id` in `wrangler.toml`.
2. Create an R2 bucket named `business-ideas`.
3. Apply migration:

```bash
wrangler d1 migrations apply business-ideas --local
wrangler d1 migrations apply business-ideas --remote
```

4. Configure AI Search and set:

```bash
wrangler secret put CLOUDFLARE_ACCOUNT_ID
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put CLOUDFLARE_AI_SEARCH_INSTANCE_ID
```

5. Deploy:

```bash
pnpm deploy
```

## MCP

The Worker exposes `/mcp` with compact typed tools. Cloudflare AI Search MCP should also be enabled for V1 once the AI Search index is live.

See [docs/business-ideas-architecture.md](docs/business-ideas-architecture.md).
