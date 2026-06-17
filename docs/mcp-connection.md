# MCP Connection

Business Ideas Knowledge Base exposes a public read-only MCP endpoint:

```text
https://business-ideas.miekki-jerry.workers.dev/mcp
```

No API key is required for the current public tools, resources, and prompts. The endpoint reads the production D1/R2 catalog and intentionally returns compact source-backed payloads instead of full transcripts.

## Claude Code

User-scoped:

```bash
claude mcp add --scope user --transport http business-ideas https://business-ideas.miekki-jerry.workers.dev/mcp
```

Project-scoped:

```bash
claude mcp add --scope project --transport http business-ideas https://business-ideas.miekki-jerry.workers.dev/mcp
```

Verify:

```bash
claude mcp get business-ideas
claude mcp list
```

## Codex CLI

```bash
codex mcp add business-ideas --url https://business-ideas.miekki-jerry.workers.dev/mcp
codex mcp get business-ideas
codex mcp list
```

## Tools

- `search_business_ideas`: natural-language idea search with optional structured filters and profile.
- `count_business_ideas`: exact count for filtered database questions.
- `list_business_ideas`: paginated compact list for browsing/filtering workflows.
- `get_business_idea`: fetch by `id` or `slug`.
- `recommend_business_ideas`: profile-based recommendations.
- `get_random_business_ideas`: random idea discovery.
- `get_idea_evidence`: compact source evidence for one idea.
- `get_business_idea_facets`: facet values and counts.
- `find_similar_business_ideas`: related ideas.
- `list_sources`: source catalogs.

## Resources

- `business-ideas://overview`: dataset overview and MCP usage guidance.
- `business-ideas://facets`: JSON facet counts.

Resource templates:

- `business-ideas://idea/{id-or-slug}`: compact context for one idea.

## Prompts

- `recommend_for_builder_profile`: recommend ideas for a builder profile.
- `compare_business_ideas`: compare a small set of ideas.
- `validation_brief`: produce a practical validation plan for one idea.

## Smoke Tests

Health:

```bash
curl -sS https://business-ideas.miekki-jerry.workers.dev/api/business-ideas/health
```

MCP initialize:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-06-18",
      "capabilities": {},
      "clientInfo": { "name": "manual-smoke", "version": "0.0.1" }
    }
  }'
```

Tools list:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

Search tool:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_business_ideas",
      "arguments": {
        "query": "podcast guest prep",
        "limit": 3
      }
    }
  }'
```

Resources:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":4,"method":"resources/read","params":{"uri":"business-ideas://overview"}}'
```

Resource templates:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":5,"method":"resources/templates/list"}'
```

Prompts:

```bash
curl -sS -X POST https://business-ideas.miekki-jerry.workers.dev/mcp \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":6,"method":"prompts/get","params":{"name":"validation_brief","arguments":{"idOrSlug":"my-ai-tax-guy"}}}'
```

Expected: compact JSON-RPC responses with `serverInfo`, tool schemas, source-backed ideas, resource contents, or prompt messages.

## Current Data

As of 2026-06-16:

- 147 ideas from the HubSpot / My First Million Business Idea Database.
- 47 reviewed ideas extracted from the 10 latest My First Million YouTube transcripts.
- 194 public ideas total.

Use the custom Worker MCP above as the default. The Cloudflare AI Search public MCP endpoint can lag behind until its index is refreshed.

## Data Contract

The MCP returns compact payloads with:

- `id`
- `slug`
- `title`
- short description fields
- score or fit reason when available
- short evidence records with `sourceTitle` and timestamp/source URLs
- `hints` or `recoveryHints` when useful

Do not expect full transcripts or raw source snapshots from the public MCP.
