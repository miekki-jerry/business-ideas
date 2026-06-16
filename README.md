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

The Worker exposes `/mcp` with compact typed tools. Cloudflare AI Search MCP should also be enabled for V1 once the AI Search index is live.

See [docs/business-ideas-architecture.md](docs/business-ideas-architecture.md).
