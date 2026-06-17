# Business Ideas MCP Connection

## Endpoints

Primary custom MCP:

```text
https://business-ideas.miekki-jerry.workers.dev/mcp
```

Worker API health:

```text
https://business-ideas.miekki-jerry.workers.dev/api/business-ideas/health
```

Avoid using the older Cloudflare AI Search public endpoint as the default connection. It may not contain the latest D1/R2-backed catalog until Cloudflare indexing is manually checked or re-run.

## Claude Code

Add globally/user-scoped:

```bash
claude mcp add --scope user --transport http business-ideas https://business-ideas.miekki-jerry.workers.dev/mcp
```

Add only for the current project:

```bash
claude mcp add --scope project --transport http business-ideas https://business-ideas.miekki-jerry.workers.dev/mcp
```

Verify:

```bash
claude mcp get business-ideas
claude mcp list
```

## Codex CLI

Add:

```bash
codex mcp add business-ideas --url https://business-ideas.miekki-jerry.workers.dev/mcp
```

Verify:

```bash
codex mcp get business-ideas
codex mcp list
```

## Raw JSON-RPC Smoke Tests

Health:

```bash
curl -sS https://business-ideas.miekki-jerry.workers.dev/api/business-ideas/health
```

Initialize:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"manual-smoke","version":"0.0.1"}}}'
```

Search tool:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_business_ideas","arguments":{"query":"podcast guest prep","limit":3}}}'
```

Resource:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":3,"method":"resources/read","params":{"uri":"business-ideas://overview"}}'
```

Prompt:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":4,"method":"prompts/get","params":{"name":"validation_brief","arguments":{"idOrSlug":"my-ai-tax-guy"}}}'
```

## Tool Names

- `search_business_ideas`: natural-language idea search.
- `count_business_ideas`: exact counts for filtered database questions.
- `list_business_ideas`: paginated compact list.
- `get_business_idea`: fetch by `id` or `slug`.
- `recommend_business_ideas`: profile-based recommendations.
- `get_random_business_ideas`: random ideas.
- `get_idea_evidence`: source evidence for one idea.
- `get_business_idea_facets`: facet values and counts.
- `find_similar_business_ideas`: related ideas.
- `list_sources`: available source collections.

## Resources And Prompts

Resources:

- `business-ideas://overview`
- `business-ideas://facets`
- `business-ideas://idea/{id-or-slug}`

Prompts:

- `recommend_for_builder_profile`
- `compare_business_ideas`
- `validation_brief`

## Data Contract

The MCP should return compact payloads with:

- `id`
- `slug`
- `title`
- short description fields
- score or fit reason when available
- short evidence records with `sourceTitle` and timestamp/source URLs
- `hints` or `recoveryHints` when helpful

Do not expect full transcripts or raw source snapshots from the public MCP.
