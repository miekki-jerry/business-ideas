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
