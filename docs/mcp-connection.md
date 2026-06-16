# MCP Connection

Business Ideas Knowledge Base exposes a public custom MCP endpoint:

```text
https://<YOUR_WORKER_URL>/mcp
```

No API key is required for the current public read-only tools.

## Claude Code

User-scoped:

```bash
claude mcp add --scope user --transport http business-ideas https://<YOUR_WORKER_URL>/mcp
```

Project-scoped:

```bash
claude mcp add --scope project --transport http business-ideas https://<YOUR_WORKER_URL>/mcp
```

Verify:

```bash
claude mcp get business-ideas
claude mcp list
```

## Codex CLI

```bash
codex mcp add business-ideas --url https://<YOUR_WORKER_URL>/mcp
codex mcp get business-ideas
codex mcp list
```

## Tools

- `search_business_ideas`
- `get_business_idea`
- `recommend_business_ideas`
- `get_random_business_ideas`
- `get_idea_evidence`
- `find_similar_business_ideas`
- `list_sources`

## Smoke Test

```bash
curl -sS -X POST https://<YOUR_WORKER_URL>/mcp \
  -H 'content-type: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
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

The response should include compact results with source evidence and timestamp URLs. The MCP intentionally does not return full transcripts.

## Current Data

As of 2026-06-16:

- 147 ideas from the HubSpot / My First Million Business Idea Database.
- 47 reviewed ideas extracted from the 10 latest My First Million YouTube transcripts.
- 194 public ideas total.

Use the custom Worker MCP above as the default. The Cloudflare AI Search public MCP endpoint can lag behind until its index is refreshed.
