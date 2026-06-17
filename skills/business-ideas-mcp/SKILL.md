---
name: business-ideas-mcp
description: Connect agents to a Business Ideas Knowledge Base MCP and use it to search, retrieve, recommend, and cite source-backed business ideas. Use when a user asks to connect Claude Code, Codex, another MCP client, or an agent workflow to a business ideas database; when they need MCP setup commands; or when they want to query the idea database through tools instead of a website.
---

# Business Ideas MCP

## Quick Start

Use the custom Worker MCP endpoint by default:

```text
https://<YOUR_WORKER_URL>/mcp
```

It is public, streamable HTTP JSON-RPC, and currently reads the production D1/R2 catalog directly. Do not default to the Cloudflare AI Search public MCP endpoint unless the user specifically asks for it; that endpoint may lag behind indexing.

For exact setup commands and verification calls, read `references/connection.md`.

## Capabilities

The custom MCP exposes compact, source-backed tools:

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

It also exposes compact resources:

- `business-ideas://overview`
- `business-ideas://facets`

And a resource template:

- `business-ideas://idea/{id-or-slug}`

And prompts:

- `recommend_for_builder_profile`
- `compare_business_ideas`
- `validation_brief`

Keep responses compact. Prefer idea IDs, slugs, short summaries, and evidence timestamp URLs over full source text. Never ask the MCP to return full transcripts; the public database intentionally exposes short quotes and timestamp links only.

## Source Status

Example production dataset:

- 147 ideas from the HubSpot / My First Million Business Idea Database.
- 47 reviewed ideas extracted from the 10 latest My First Million YouTube transcripts as of 2026-06-16.
- 194 public ideas total.

If a user asks about additional sources, say that research candidates exist but are not imported yet unless current repo state shows otherwise.
