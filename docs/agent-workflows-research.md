# Agent workflows: research and interpretation

## Scope

This catalog is a separate, read-only product surface. It does not use Business Ideas AI Search, vector indexing, R2, chat, assistants, or MCP. The committed TypeScript dataset is the source of truth; D1 is a publication/read replica containing the complete record as `content_json`.

## Selection method

We started from concrete enterprise and practitioner examples, then normalized them into reusable trigger-to-output workflows. A record was accepted only when it has:

- a specific event or threshold that starts the work;
- named inputs and at least one system integration;
- multiple agent steps that produce an operational output;
- an accountable human checkpoint;
- explicit failure risks and enforceable guardrails;
- a measurable operational KPI;
- one or two public HTTP sources whose claim is narrower than the workflow description.

Business function is the primary category. Industry and company size are filters, not substitutes for the workflow category. Similar examples were merged when they had the same trigger, decision, human gate, and output.

The catalog has no target record count. A workflow stays unpublished when it is mainly a reminder, a generic writing or search feature, a deterministic rule better handled by ordinary automation, a risky judgment without sufficient evidence, or a weaker duplicate of a more complete workflow.

## Rejection criteria

We rejected generic “summarize”, “draft”, and “analyze” ideas without a trigger, system boundary, approval gate, and KPI. We also rejected autonomous high-stakes decisions, untraceable claims, product demos without a repeatable operating process, duplicates distinguished only by tool brand, and impact claims that could not be expressed as a bounded range.

## How to read impact percentages

`impact.min` and `impact.max` describe a planning range for the named `impact.metric`, not a guaranteed ROI and not a universal productivity percentage.

- `case_study`: anchored to a public customer story. The range can still be broader than a quoted result when the source lacks a comparable denominator.
- `vendor_report`: based on a vendor-published operational result or documented production pattern; treat it as externally reported, not independently audited.
- `research`: derived from several documented workflow patterns and removal of identifiable manual touches.
- `editorial_estimate`: directional estimate for prioritization where credible workflow evidence exists but no comparable outcome measurement was published.

`confidence` rates how directly the evidence maps to the exact metric. Before rollout, teams should measure a baseline at the same unit of work, run a controlled pilot, track exception and rework rates, and replace the editorial range with their own observed distribution.

## Risks that apply across the catalog

- Stale or incomplete source systems can make a fluent answer wrong.
- Automation can amplify biased rubrics in recruiting, service, fraud, or risk routing.
- Broad tool permissions turn an analysis error into a material write action.
- Sensitive customer, employee, legal, finance, and security data requires least privilege, retention controls, and auditability.
- Human approval can become rubber-stamping if evidence and uncertainty are not visible.
- Case-study metrics are context-specific and often vendor-reported.

The model therefore separates `minimumStack` from example `tools`, labels `riskLevel`, requires human checkpoints, and supplies record-specific guardrails. High-risk actions remain deterministic or human-approved.

## Source inventory

Primary official sources:

- Salesforce: Agentforce for Sales; Agentforce for Events; Engine agentic service.
- OpenAI: Clay; Contract Data Agent; OpenAI–PwC finance collaboration; Basis accounting agents.
- AWS: Gradial marketing operations case study.
- Google Cloud: Qualia title and escrow; TELUS customer experience.
- Anthropic: Tines, Newfront, Gradient Labs, Palo Alto Networks, Sentry, Trellix, Stairwell, and Vanta customer stories.
- Microsoft: Copilot Studio internal customer story; Danone; Auquan.
- Workday: conversational AI and employee-service customer story.
- Harvey: Workflow Builder for repeatable legal work.

Practical implementation signals:

- Kaxil Naik: <https://x.com/kaxil/status/2037503513350005134>
- Michel Lieben: <https://x.com/MichLieben/status/2034699108808892730>
- Riley Brown: <https://x.com/rileybrown_ai/status/1941524123525533750>

Social posts are supporting implementation examples only. They do not justify measured impact claims.

## Matthew Berman video review — 2026-10-13

Source: [12 Grok Bot Use Cases That Feel Illegal](https://www.youtube.com/watch?v=BsNHg6cNjZE), Matthew Berman, published 2026-10-07, duration 25:39. The review used YouTube's English automatic captions, retrieved with yt-dlp; this is not a manually verified transcription. Full captions and the working timestamped transcript stay in ignored `.private/transcripts/BsNHg6cNjZE/`.

Eight additions were accepted. Each links to its relevant chapter, has Polish and English operational content, and uses `emerging` maturity. The integrations describe an implementation proposal, not an independently tested Grok Bot capability. Approval gates are deliberately stricter than some spoken demonstrations and follow the video's displayed prompts where they differ.

| Chapter | Catalog slug | Editorial decision |
| --- | --- | --- |
| 00:38 | `subscription-discount-negotiation` | Subscription evidence and vendor-specific discount requests; cancellation and new terms need approval. |
| 04:05 | `disk-cleanup-review` | Contextual review of caches, exports, and originals; exact paths require approval before moving to Trash. |
| 07:11 | `personal-daily-action-brief` | Cross-source meeting context and urgent commitments; read-only and private. |
| 08:21 | `school-email-to-family-logistics` | Extract changing school commitments, match calendar events, and prepare event-specific duties. |
| 11:28 | `creator-sponsorship-dm-triage` | Triage inbound creator DMs, verify identity, and draft replies; distinct from researching brand fit. |
| 13:42–18:09 | `meeting-commitments-to-personal-tasks` | Merge meeting-summary and to-do-manager patterns into one commitment-to-task reconciliation workflow; distinct from CRM updates. |
| 20:40 | `utility-rate-plan-comparison` | Retrieve usage and eligible official plans; deterministic calculations and an explicit switch decision. PG&E is the author's example, not a Polish provider recommendation. |
| 22:09 | `calendar-aware-appointment-booking` | Coordinate provider slots with several calendars and verify a user-approved booking; distinct from detecting calendar clashes. |

Remaining examples were reviewed rather than added indiscriminately:

- Email triage (18:10): covered by `personal-inbox-action-triage`; no duplicate.
- Tesla preparation (02:36): the demonstrated preset commands do not establish a distinct reasoning-heavy workflow; physical access and movement are outside these additions.
- Unclaimed-property search (01:44): jurisdiction-specific discovery and claim submission need stronger eligibility evidence; no generic legal or financial claim workflow added.
- Uber and DoorDash (23:57): basic repeat booking or reorder requests are too close to ordinary tool automation. The suggested cross-agent orchestration lacks a sufficiently detailed independent process here.
- Sponsor advertisements and community promotion: excluded.

The video reports personal cost and time savings. These were not independently verified and are not catalog outcome metrics. New impact ranges are explicitly low-confidence editorial planning ranges of 0–30% for a named manual preparation task, allowing no improvement. They are not forecasts of subscription savings, utility savings, or ROI. A pilot must measure baseline effort, corrections, and exceptions before replacing the range with observed outcomes.
