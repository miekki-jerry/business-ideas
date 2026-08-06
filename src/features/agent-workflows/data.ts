import type {
  AgentWorkflow,
  AgentWorkflowArchetype,
  AgentWorkflowCategory,
  AgentWorkflowDifficulty,
  AgentWorkflowMaturity,
  AgentWorkflowRiskLevel,
  CompanySize,
  ImpactConfidence,
  ImpactEstimateBasis,
  LocalizedText,
  WorkflowCapability,
  WorkflowContext,
  WorkflowSource,
} from './types'

type Pair = readonly [en: string, pl: string]

type Blueprint = {
  slug: string
  title: Pair
  oneLiner: Pair
  category: AgentWorkflowCategory
  department: Pair
  archetype: AgentWorkflowArchetype
  contexts?: WorkflowContext[]
  primaryUser?: Pair
  benefit?: Pair
  complexity?: 1 | 2 | 3 | 4 | 5
  capabilities?: WorkflowCapability[]
  beforeAgentic?: Pair
  whyAgentic?: Pair
  industries: string[]
  companySizes: CompanySize[]
  difficulty: AgentWorkflowDifficulty
  maturity: AgentWorkflowMaturity
  riskLevel: AgentWorkflowRiskLevel
  weeks: readonly [number, number]
  trigger: Pair
  inputs: Pair[]
  steps: Pair[]
  checkpoint: Pair
  outputs: Pair[]
  minimumStack: Pair[]
  tools: Array<readonly [name: string, role: Pair]>
  risk: Pair
  mitigation: Pair
  guardrails: Pair[]
  impact: readonly [
    min: number,
    max: number,
    metric: Pair,
    basis: ImpactEstimateBasis,
    confidence: ImpactConfidence,
    explanation: Pair,
  ]
  sourceKeys: SourceKey[]
}

const l = ([en, pl]: Pair): LocalizedText => ({ en, pl })

const sources = {
  salesforceSales: {
    title: 'Agentforce for Sales customer stories',
    publisher: 'Salesforce',
    url: 'https://www.salesforce.com/customer-stories/agentforce-for-sales',
    claim: [
      'Salesforce documents agents that qualify, research, and route sales opportunities inside CRM workflows.',
      'Salesforce opisuje agentów kwalifikujących, badających i kierujących szanse sprzedażowe w procesach CRM.',
    ],
  },
  salesforceEvents: {
    title: 'Building agents for events',
    publisher: 'Salesforce',
    url: 'https://www.salesforce.com/customer-stories/agentforce-for-events-agent/building-agents/',
    claim: [
      'Salesforce describes an event concierge agent grounded in event data and connected to attendee actions.',
      'Salesforce opisuje agenta concierge opartego na danych wydarzenia i połączonego z akcjami uczestnika.',
    ],
  },
  salesforceService: {
    title: 'Engine builds agentic customer service',
    publisher: 'Salesforce',
    url: 'https://www.salesforce.com/customer-stories/engine/agentic-service/',
    claim: [
      'Engine uses an agentic service workflow to answer and route customer requests while retaining escalation paths.',
      'Engine używa agentowego procesu obsługi do odpowiadania i kierowania zgłoszeń z zachowaniem eskalacji.',
    ],
  },
  clay: {
    title: 'Clay uses OpenAI to scale go-to-market work',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/clay/',
    claim: [
      'Clay combines research, enrichment, and personalized outreach in repeatable go-to-market workflows.',
      'Clay łączy research, enrichment i personalizowany outreach w powtarzalnych procesach go-to-market.',
    ],
  },
  gradial: {
    title: 'Gradial case study',
    publisher: 'Amazon Web Services',
    url: 'https://aws.amazon.com/solutions/case-studies/gradial-case-study/',
    claim: [
      'Gradial automates multi-step marketing production and content operations with reviewable agent workflows.',
      'Gradial automatyzuje wieloetapową produkcję marketingową i content operations w kontrolowanych procesach agentowych.',
    ],
  },
  contractAgent: {
    title: 'Turning contracts into searchable data at OpenAI',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/openai-contract-data-agent/',
    claim: [
      'OpenAI reports an overnight, expert-reviewed contract extraction workflow that cut review turnaround in half.',
      'OpenAI opisuje nocny, weryfikowany przez ekspertów proces ekstrakcji umów, który skrócił czas przeglądu o połowę.',
    ],
  },
  pwcFinance: {
    title: 'OpenAI and PwC collaborate to reimagine the office of the CFO',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/openai-pwc-finance-collaboration/',
    claim: [
      'OpenAI and PwC identify procurement, payments, treasury, reporting, and close as governed agent workflows.',
      'OpenAI i PwC wskazują procurement, płatności, treasury, raportowanie i close jako procesy dla nadzorowanych agentów.',
    ],
  },
  basis: {
    title: 'Basis scales accounting with trusted agents',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/basis/',
    claim: [
      'Basis reports up to 30% time savings for reviewable accounting workflows including reconciliations and entries.',
      'Basis raportuje do 30% oszczędności czasu w kontrolowanych procesach księgowych, m.in. uzgodnieniach i zapisach.',
    ],
  },
  qualia: {
    title: 'Qualia automates real estate transactions at scale with Gemini',
    publisher: 'Google Cloud',
    url: 'https://cloud.google.com/customers/qualia',
    claim: [
      'Qualia Clear reviews transaction emails and documents, detects errors, and executes title and escrow tasks.',
      'Qualia Clear analizuje e-maile i dokumenty transakcji, wykrywa błędy i wykonuje zadania title oraz escrow.',
    ],
  },
  telus: {
    title: 'TELUS customer experience with Gemini Enterprise',
    publisher: 'Google Cloud',
    url: 'https://cloud.google.com/customers/telus-gemini-enterprise-cx',
    claim: [
      'TELUS describes grounded customer-service assistance across complex product and policy information.',
      'TELUS opisuje opartą na źródłach pomoc w obsłudze klienta przy złożonych produktach i politykach.',
    ],
  },
  tines: {
    title: 'Tines transforms workflow automation with Claude',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/tines',
    claim: [
      'Tines reports complex security and IT workflows compiled from natural language with controlled tool use.',
      'Tines opisuje złożone procesy security i IT kompilowane z języka naturalnego z kontrolowanym użyciem narzędzi.',
    ],
  },
  newfront: {
    title: 'Newfront transforms insurance work with Claude',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/newfront',
    claim: [
      'Newfront applies Claude to document-heavy insurance workflows while keeping brokers responsible for decisions.',
      'Newfront stosuje Claude w dokumentowych procesach ubezpieczeniowych, pozostawiając decyzje brokerom.',
    ],
  },
  gradient: {
    title: 'Gradient Labs builds AI agents for financial services',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/gradient-labs',
    claim: [
      'Gradient Labs automates regulated financial-service operations with auditable actions and human escalation.',
      'Gradient Labs automatyzuje regulowane operacje finansowe z audytem działań i eskalacją do człowieka.',
    ],
  },
  paloAlto: {
    title: 'Palo Alto Networks customer story',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/palo-alto-networks',
    claim: [
      'Palo Alto Networks uses Claude in security-sensitive engineering workflows with enterprise controls.',
      'Palo Alto Networks używa Claude w wrażliwych procesach inżynieryjnych z kontrolami enterprise.',
    ],
  },
  sentry: {
    title: 'Sentry customer story',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/sentry',
    claim: [
      'Sentry uses Claude to help investigate software issues using rich technical context.',
      'Sentry używa Claude do badania problemów oprogramowania na podstawie bogatego kontekstu technicznego.',
    ],
  },
  trellix: {
    title: 'Trellix deploys autonomous security agents',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/trellix',
    claim: [
      'Trellix reports automated alert analysis saving eight staff hours per 100 alerts.',
      'Trellix raportuje automatyczną analizę alertów oszczędzającą osiem godzin pracy na 100 alertów.',
    ],
  },
  stairwell: {
    title: 'Stairwell protects companies with Claude',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/stairwell',
    claim: [
      'Stairwell uses Claude to analyze malware evidence and turn technical findings into actionable summaries.',
      'Stairwell używa Claude do analizy śladów malware i zamiany technicznych ustaleń w działania.',
    ],
  },
  vanta: {
    title: 'Vanta automates compliance remediation with Claude',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/customers/vanta',
    claim: [
      'Vanta generates precise remediation guidance for compliance findings that previously needed manual research.',
      'Vanta generuje precyzyjne instrukcje naprawcze dla ustaleń compliance wcześniej wymagających ręcznego researchu.',
    ],
  },
  microsoftCopilot: {
    title: 'Microsoft Copilot Studio customer story',
    publisher: 'Microsoft',
    url: 'https://www.microsoft.com/en/customers/story/26166-microsoft-microsoft-copilot-studio',
    claim: [
      'Microsoft documents internal agents that resolve employee cases across connected enterprise systems.',
      'Microsoft opisuje wewnętrznych agentów rozwiązujących sprawy pracowników w połączonych systemach enterprise.',
    ],
  },
  danone: {
    title: 'Danone and Microsoft 365 Copilot',
    publisher: 'Microsoft',
    url: 'https://www.microsoft.com/en/customers/story/25506-danone-microsoft-365-copilot',
    claim: [
      'Danone applies Copilot to knowledge-intensive employee workflows with organizational governance.',
      'Danone stosuje Copilot w procesach wiedzy pracowników z nadzorem organizacyjnym.',
    ],
  },
  workday: {
    title: 'Workday saves thousands of hours with conversational AI',
    publisher: 'Workday',
    url: 'https://www.workday.com/en-us/customer-stories/q-z/workday-saves-thousands-hours-annually-conversational-ai.html',
    claim: [
      'Workday documents conversational automation for employee support and case deflection at scale.',
      'Workday opisuje konwersacyjną automatyzację wsparcia pracowników i ograniczanie spraw w skali.',
    ],
  },
  harvey: {
    title: 'Introducing Workflow Builder',
    publisher: 'Harvey',
    url: 'https://www.harvey.ai/blog/introducing-workflow-builder',
    claim: [
      'Harvey describes repeatable legal workflows combining document analysis, drafting, and lawyer review.',
      'Harvey opisuje powtarzalne procesy prawne łączące analizę dokumentów, drafting i przegląd prawnika.',
    ],
  },
  auquan: {
    title: 'Auquan and Azure customer story',
    publisher: 'Microsoft',
    url: 'https://www.microsoft.com/en/customers/story/23303-auquan-azure',
    claim: [
      'Auquan uses AI agents to collect and synthesize investment research with traceable source material.',
      'Auquan używa agentów do zbierania i syntezy researchu inwestycyjnego z identyfikowalnymi źródłami.',
    ],
  },
  xKaxil: {
    title: 'Production agent workflow example',
    publisher: 'Kaxil Naik on X',
    url: 'https://x.com/kaxil/status/2037503513350005134',
    claim: [
      'A practitioner example shows event-triggered agents coordinating operational work across tools.',
      'Praktyczny przykład pokazuje agentów uruchamianych zdarzeniami i koordynujących pracę między narzędziami.',
    ],
  },
  xLieben: {
    title: 'Enterprise agent workflow example',
    publisher: 'Michel Lieben on X',
    url: 'https://x.com/MichLieben/status/2034699108808892730',
    claim: [
      'A practitioner example illustrates guarded enterprise automation rather than a standalone chat experience.',
      'Praktyczny przykład ilustruje kontrolowaną automatyzację enterprise zamiast samodzielnego czatu.',
    ],
  },
  xRiley: {
    title: 'Multi-step agent workflow example',
    publisher: 'Riley Brown on X',
    url: 'https://x.com/rileybrown_ai/status/1941524123525533750',
    claim: [
      'A practitioner demonstration shows a multi-step agent moving from research to actions in connected tools.',
      'Demonstracja pokazuje wieloetapowego agenta przechodzącego od researchu do działań w połączonych narzędziach.',
    ],
  },
  openclawOfficial: {
    title: 'OpenClaw — personal AI assistant',
    publisher: 'OpenClaw Foundation',
    url: 'https://github.com/openclaw/openclaw',
    claim: [
      'OpenClaw documents an always-on personal agent that works across messaging, local devices, files, tools, and persistent skills.',
      'OpenClaw opisuje stale dostępnego agenta osobistego działającego w komunikatorach, na lokalnych urządzeniach, plikach, narzędziach i trwałych skillach.',
    ],
  },
  openclawCommunity: {
    title: '87 OpenClaw workflows from one user',
    publisher: 'OpenClaw community on Reddit',
    url: 'https://www.reddit.com/r/openclaw/comments/1sjr3ep/my_87_use_cases_for_openclaw_they_became_more/',
    claim: [
      'A long-running user documents personal, financial, shopping, infrastructure, research, and client workflows completed through an agent.',
      'Użytkownik opisuje osobiste, finansowe, zakupowe, techniczne, researchowe i klienckie workflowy wykonane przez agenta.',
    ],
  },
  openclawOperations: {
    title: 'Three months with OpenClaw as a daily agent',
    publisher: 'OpenClaw community on Reddit',
    url: 'https://www.reddit.com/r/openclaw/comments/1ta6cca/roughly_3_month_running_openclaw_as_my_daily/',
    claim: [
      'A practitioner reports sustained use of memory, scheduled checks, research, subagents, files, APIs, and bounded operational tasks.',
      'Praktyk opisuje długotrwałe użycie pamięci, cyklicznych kontroli, researchu, subagentów, plików, API i ograniczonych zadań operacyjnych.',
    ],
  },
  hermesDocs: {
    title: 'Hermes Agent learning path and use cases',
    publisher: 'Nous Research',
    url: 'https://hermes-agent.nousresearch.com/docs/getting-started/learning-path/',
    claim: [
      'Hermes documents personal and team agents with browser tools, memory, voice, scheduled tasks, batch work, delegation, and code execution.',
      'Hermes opisuje agentów osobistych i zespołowych z przeglądarką, pamięcią, głosem, harmonogramem, batch processingiem, delegacją i wykonywaniem kodu.',
    ],
  },
  openaiOperator: {
    title: 'Computer-Using Agent',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/computer-using-agent/',
    claim: [
      'OpenAI shows a vision-based agent navigating changing interfaces through screenshots, reasoning, mouse, and keyboard actions.',
      'OpenAI pokazuje agenta opartego na vision, który porusza się po zmiennych interfejsach za pomocą screenshotów, rozumowania, myszy i klawiatury.',
    ],
  },
  openaiShopping: {
    title: 'Shopping research in ChatGPT',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/chatgpt-shopping-research/',
    claim: [
      'OpenAI describes multi-source product research that compares complex constraints, reviews, availability, and price before a user decides.',
      'OpenAI opisuje wieloźródłowy research produktów porównujący złożone wymagania, opinie, dostępność i cenę przed decyzją użytkownika.',
    ],
  },
  langfuseDigest: {
    title: 'How Langfuse synthesizes what users want',
    publisher: 'Langfuse',
    url: 'https://langfuse.com/blog/2026-03-13-weekly-digest-ai-skill',
    claim: [
      'Langfuse documents an agent that groups support tickets, GitHub issues, and meeting transcripts into a cited weekly product digest.',
      'Langfuse opisuje agenta grupującego tickety supportu, issue z GitHuba i transkrypcje spotkań w cotygodniowy digest produktu ze źródłami.',
    ],
  },
  langfuseEvaluation: {
    title: 'Evaluating AI agent skills',
    publisher: 'Langfuse',
    url: 'https://langfuse.com/blog/2026-02-26-evaluate-ai-agent-skills',
    claim: [
      'Langfuse shows agents turning production traces and human feedback into datasets, experiments, and measurable regression checks.',
      'Langfuse pokazuje agentów zamieniających trace produkcyjne i feedback ludzi w datasety, eksperymenty i mierzalne testy regresji.',
    ],
  },
  n8nBordr: {
    title: 'Bordr runs a six-figure service business on n8n',
    publisher: 'n8n',
    url: 'https://n8n.io/case-studies/bordr/',
    claim: [
      'Bordr connects payment, documents, partners, status updates, and customer delivery in one multi-step service workflow.',
      'Bordr łączy płatność, dokumenty, partnerów, aktualizacje statusu i dostarczenie rezultatu klientowi w jednym wieloetapowym procesie.',
    ],
  },
  n8nCases: {
    title: 'n8n customer case studies',
    publisher: 'n8n',
    url: 'https://n8n.io/case-studies/',
    claim: [
      'n8n customer stories document practical small-business workflows across offers, ecommerce imports, lead handling, documents, and operations.',
      'Case studies n8n opisują praktyczne workflowy małych firm obejmujące oferty, importy ecommerce, leady, dokumenty i operacje.',
    ],
  },
  openaiAgentsTools: {
    title: 'New tools for building agents',
    publisher: 'OpenAI',
    url: 'https://openai.com/index/new-tools-for-building-agents/',
    claim: [
      'OpenAI documents agents combining web search, files, browser control, tool use, handoffs, guardrails, and traceable multi-step execution.',
      'OpenAI opisuje agentów łączących research w sieci, pliki, sterowanie przeglądarką, narzędzia, handoffy, guardraile i śledzone wykonanie wielu kroków.',
    ],
  },
} satisfies Record<string, Omit<WorkflowSource, 'claim'> & { claim: Pair }>

type SourceKey = keyof typeof sources

const commonStack = {
  crm: [
    ['Event or queue trigger', 'Trigger zdarzeniowy lub kolejka'],
    ['LLM with structured output', 'LLM ze strukturalnym outputem'],
    ['CRM write API with audit log', 'API zapisu CRM z logiem audytowym'],
  ] satisfies Pair[],
  documents: [
    ['Document ingestion and OCR', 'Ingest dokumentów i OCR'],
    ['LLM with citations', 'LLM z cytowaniami'],
    ['Review queue and audit log', 'Kolejka przeglądu i log audytowy'],
  ] satisfies Pair[],
  operations: [
    ['Event bus or scheduled trigger', 'Event bus lub trigger harmonogramu'],
    ['LLM with tool calling', 'LLM z wywoływaniem narzędzi'],
    ['Approval queue and audit log', 'Kolejka akceptacji i log audytowy'],
  ] satisfies Pair[],
}

function buildWorkflow(blueprint: Blueprint): AgentWorkflow {
  const [min, max, metric, estimateBasis, confidence, explanation] = blueprint.impact
  const summaryTail = {
    'enrich-and-route': [
      'It resolves identity, enriches the case with approved evidence, and shows why the proposed route is appropriate before anything is assigned.',
      'Rozpoznaje sprawę, wzbogaca ją zatwierdzonymi dowodami i pokazuje, dlaczego proponowany routing jest właściwy, zanim cokolwiek zostanie przypisane.',
    ],
    'draft-and-approve': [
      'It produces a source-linked draft, validates it against policy, and keeps publication or system updates behind an explicit approval.',
      'Tworzy draft powiązany ze źródłami, sprawdza go względem polityk i pozostawia publikację lub zapis w systemie za jawną akceptacją.',
    ],
    'investigate-and-report': [
      'It separates observed facts from inference, surfaces conflicting evidence, and delivers a review-ready finding set instead of an opaque answer.',
      'Oddziela obserwowane fakty od wniosków, pokazuje sprzeczne dowody i dostarcza zestaw ustaleń gotowy do przeglądu zamiast nieprzejrzystej odpowiedzi.',
    ],
    'reconcile-and-flag': [
      'It uses deterministic matching where possible, isolates unresolved differences, and leaves every material classification to an accountable reviewer.',
      'Stosuje deterministyczne dopasowanie tam, gdzie to możliwe, izoluje niewyjaśnione różnice i pozostawia każdą istotną klasyfikację odpowiedzialnej osobie.',
    ],
    'monitor-and-alert': [
      'It evaluates fresh signals against a defined baseline, suppresses weak alerts, and creates an owned task only when the evidence crosses an approved threshold.',
      'Porównuje świeże sygnały z ustalonym punktem odniesienia, wycisza słabe alerty i tworzy przypisane zadanie dopiero po przekroczeniu zatwierdzonego progu.',
    ],
    'orchestrate-multi-step': [
      'It coordinates dependencies across connected systems, pauses at exception boundaries, and records the state of every approved sub-step.',
      'Koordynuje zależności między połączonymi systemami, zatrzymuje się na granicach wyjątków i zapisuje stan każdego zatwierdzonego podkroku.',
    ],
    'auto-execute-with-guardrails': [
      'It validates identity and permissions, simulates the bounded action, and executes only the approved change with verification and rollback evidence.',
      'Weryfikuje tożsamość i uprawnienia, symuluje ograniczoną akcję i wykonuje wyłącznie zatwierdzoną zmianę z weryfikacją oraz dowodem możliwości wycofania.',
    ],
  } satisfies Record<AgentWorkflowArchetype, Pair>
  const agenticDifference = {
    'enrich-and-route': {
      before: [
        'Rule-based routing handled only clean, predefined fields and broke when the request was incomplete or written in natural language.',
        'Reguły działały tylko na czystych, z góry znanych polach. Nie radziły sobie z niepełnym zgłoszeniem ani opisem napisanym własnymi słowami.',
      ],
      now: [
        'The agent can interpret unstructured context, gather missing evidence, explain its recommendation, and pause when confidence is low.',
        'Agent rozumie nieustrukturyzowany kontekst, dobiera brakujące dowody, uzasadnia rekomendację i zatrzymuje się przy niskiej pewności.',
      ],
    },
    'draft-and-approve': {
      before: [
        'Templates could merge known fields, but they could not understand source documents or adapt the draft to exceptions.',
        'Szablony potrafiły wstawić znane pola, ale nie rozumiały dokumentów źródłowych ani wyjątków.',
      ],
      now: [
        'The agent reads source material, drafts the right version for the case, cites evidence, and leaves the final send or write to a person.',
        'Agent czyta materiały źródłowe, tworzy wersję dopasowaną do sprawy, wskazuje dowody i zostawia człowiekowi ostateczne wysłanie lub zapis.',
      ],
    },
    'investigate-and-report': {
      before: [
        'Traditional automation could collect records, but a person still had to compare sources, resolve conflicts, and write the conclusion.',
        'Tradycyjna automatyzacja potrafiła zebrać rekordy, ale człowiek nadal musiał porównać źródła, rozstrzygnąć sprzeczności i opisać wnioski.',
      ],
      now: [
        'The agent can plan a search, inspect multiple sources, distinguish facts from inference, and return a cited report.',
        'Agent planuje research, sprawdza wiele źródeł, oddziela fakty od wniosków i zwraca raport z odnośnikami.',
      ],
    },
    'reconcile-and-flag': {
      before: [
        'Exact matching worked for identical records; ambiguous names, missing fields, and inconsistent documents still created a manual queue.',
        'Dokładne dopasowanie działało dla identycznych rekordów. Niejasne nazwy, brakujące pola i niespójne dokumenty nadal wymagały ręcznej pracy.',
      ],
      now: [
        'The agent combines deterministic checks with document understanding, explains uncertain matches, and sends only real exceptions for review.',
        'Agent łączy twarde reguły z rozumieniem dokumentów, wyjaśnia niepewne dopasowania i wysyła do sprawdzenia tylko rzeczywiste wyjątki.',
      ],
    },
    'monitor-and-alert': {
      before: [
        'Threshold alerts fired on isolated numbers and created noise because they did not understand context or prior decisions.',
        'Alerty progowe reagowały na pojedyncze liczby i generowały szum, bo nie rozumiały kontekstu ani wcześniejszych decyzji.',
      ],
      now: [
        'The agent keeps context over time, checks several signals, explains what changed, and recommends a bounded next step.',
        'Agent pamięta kontekst, sprawdza kilka sygnałów, wyjaśnia zmianę i proponuje bezpieczny kolejny krok.',
      ],
    },
    'orchestrate-multi-step': {
      before: [
        'A fixed workflow required every system and input to behave exactly as expected; one exception stopped the entire chain.',
        'Sztywny workflow wymagał, by każdy system i dane zachowywały się dokładnie zgodnie z planem. Jeden wyjątek zatrzymywał cały proces.',
      ],
      now: [
        'The agent chooses the next tool from the current state, recovers from common exceptions, and asks for a decision at the right boundary.',
        'Agent dobiera kolejne narzędzie do bieżącego stanu, radzi sobie z typowymi wyjątkami i prosi o decyzję we właściwym momencie.',
      ],
    },
    'auto-execute-with-guardrails': {
      before: [
        'API and RPA automations could repeat known clicks, but they were brittle when the interface or situation changed.',
        'Automatyzacje API i RPA potrafiły powtarzać znane kliknięcia, ale łatwo psuły się po zmianie interfejsu lub sytuacji.',
      ],
      now: [
        'With vision, browser control, and reasoning, the agent can inspect the current screen, adapt the path, and stop before a sensitive action.',
        'Dzięki vision, sterowaniu przeglądarką i rozumowaniu agent sprawdza bieżący ekran, dostosowuje ścieżkę i zatrzymuje się przed wrażliwą akcją.',
      ],
    },
  } satisfies Record<AgentWorkflowArchetype, { before: Pair; now: Pair }>
  const defaultContexts: WorkflowContext[] = blueprint.companySizes.includes('small')
    ? ['small-business', 'team']
    : ['team', 'enterprise']
  const defaultComplexity = blueprint.difficulty === 'low' ? 1 : blueprint.difficulty === 'medium' ? 3 : 5
  const defaultCapabilities = getCapabilities(blueprint)

  return {
    id: `workflow_${blueprint.slug.replaceAll('-', '_')}`,
    slug: blueprint.slug,
    title: l(blueprint.title),
    oneLiner: l(blueprint.oneLiner),
    summary: {
      en: `${blueprint.oneLiner[0]} ${summaryTail[blueprint.archetype][0]}`,
      pl: `${blueprint.oneLiner[1]} ${summaryTail[blueprint.archetype][1]}`,
    },
    category: blueprint.category,
    department: l(blueprint.department),
    archetype: blueprint.archetype,
    contexts: blueprint.contexts ?? defaultContexts,
    primaryUser: l(blueprint.primaryUser ?? blueprint.department),
    benefit: l(blueprint.benefit ?? blueprint.outputs[0]),
    complexity: blueprint.complexity ?? defaultComplexity,
    capabilities: blueprint.capabilities ?? defaultCapabilities,
    beforeAgentic: l(blueprint.beforeAgentic ?? agenticDifference[blueprint.archetype].before),
    whyAgentic: l(blueprint.whyAgentic ?? agenticDifference[blueprint.archetype].now),
    industries: blueprint.industries,
    companySizes: blueprint.companySizes,
    difficulty: blueprint.difficulty,
    maturity: blueprint.maturity,
    riskLevel: blueprint.riskLevel,
    implementationTime: { min: blueprint.weeks[0], max: blueprint.weeks[1], unit: 'weeks' },
    trigger: l(blueprint.trigger),
    inputs: blueprint.inputs.map(l),
    agentSteps: blueprint.steps.map((action, index) => ({ order: index + 1, action: l(action) })),
    humanCheckpoints: [{ afterStep: blueprint.steps.length - 1, decision: l(blueprint.checkpoint) }],
    outputs: blueprint.outputs.map(l),
    minimumStack: blueprint.minimumStack.map(l),
    tools: blueprint.tools.map(([name, role]) => ({ name, role: l(role) })),
    risks: [{ risk: l(blueprint.risk), mitigation: l(blueprint.mitigation) }],
    guardrails: blueprint.guardrails.map(l),
    impact: {
      min,
      max,
      unit: 'percent',
      metric: l(metric),
      estimateBasis,
      confidence,
      explanation: l(explanation),
    },
    sources: blueprint.sourceKeys.map((key) => ({ ...sources[key], claim: l(sources[key].claim) })),
    published: true,
    updatedAt: '2026-07-28T00:00:00.000Z',
  }
}

function getCapabilities(blueprint: Blueprint): WorkflowCapability[] {
  const capabilities: WorkflowCapability[] = ['tool-use', 'human-approval']

  if (blueprint.archetype === 'investigate-and-report') {
    capabilities.push('web-research', 'document-understanding')
  }
  if (blueprint.archetype === 'draft-and-approve' || blueprint.archetype === 'reconcile-and-flag') {
    capabilities.push('document-understanding')
  }
  if (blueprint.archetype === 'monitor-and-alert') {
    capabilities.push('memory', 'scheduled-monitoring')
  }
  if (blueprint.archetype === 'orchestrate-multi-step') {
    capabilities.push('multi-step-planning')
  }
  if (blueprint.archetype === 'auto-execute-with-guardrails') {
    capabilities.push('browser-actions', 'multi-step-planning')
  }
  return capabilities
}

type CompactSpec = {
  slug: string
  title: Pair
  oneLiner: Pair
  category: AgentWorkflowCategory
  department: Pair
  archetype: AgentWorkflowArchetype
  contexts?: WorkflowContext[]
  primaryUser?: Pair
  benefit?: Pair
  complexity?: 1 | 2 | 3 | 4 | 5
  capabilities?: WorkflowCapability[]
  beforeAgentic?: Pair
  whyAgentic?: Pair
  industries: string[]
  riskLevel: AgentWorkflowRiskLevel
  maturity: AgentWorkflowMaturity
  trigger: Pair
  subject: Pair
  decision: Pair
  output: Pair
  system: string
  impact: readonly [number, number, Pair, ImpactEstimateBasis, ImpactConfidence]
  impactExplanation?: Pair
  sourceKeys: SourceKey[]
}

const compactPatterns = {
  'enrich-and-route': {
    steps: [
      ['Resolve the case identity and validate source freshness.', 'Rozpoznaje sprawę i sprawdza aktualność źródeł.'],
      ['Enrich the case with approved context and show every scoring signal.', 'Wzbogaca sprawę zatwierdzonym kontekstem i pokazuje każdy sygnał oceny.'],
      ['Prepare {{decision}} with confidence and exceptions.', 'Przygotowuje {{decision}} wraz z poziomem pewności i wyjątkami.'],
      ['Create the approved assignment and notify its owner.', 'Tworzy zatwierdzone przypisanie i powiadamia odpowiedzialną osobę.'],
    ],
    risk: ['A wrong identity match can send a case to the wrong owner.', 'Błędne rozpoznanie może skierować sprawę do niewłaściwej osoby.'],
    mitigation: ['Require deterministic identifiers and expose the routing rationale.', 'Wymagaj deterministycznych identyfikatorów i pokazuj uzasadnienie routingu.'],
    guardrails: [
      ['Do not route low-confidence identity matches automatically.', 'Nie kieruj automatycznie dopasowań tożsamości o niskiej pewności.'],
      ['Use an allowlist of destinations and writable fields.', 'Stosuj zamkniętą listę miejsc docelowych i pól, które wolno zmieniać.'],
    ],
  },
  'draft-and-approve': {
    steps: [
      ['Assemble the current source material, template, and policy version.', 'Zbiera aktualne materiały źródłowe, szablon i wersję polityki.'],
      ['Draft only claims that can be linked to allowed evidence.', 'Tworzy draft wyłącznie z tezami powiązanymi z dozwolonymi dowodami.'],
      ['Prepare {{decision}} and mark every unresolved exception.', 'Przygotowuje {{decision}} i oznacza każdy nierozwiązany wyjątek.'],
      ['Publish or write back only the approved version.', 'Publikuje lub zapisuje wyłącznie zatwierdzoną wersję.'],
    ],
    risk: ['Unsupported claims can enter a customer-facing or regulated record.', 'Niepotwierdzone tezy mogą trafić do komunikacji klienta lub regulowanego rekordu.'],
    mitigation: ['Attach evidence to material claims and block approval when citations are missing.', 'Dołączaj dowody do istotnych tez i blokuj akceptację przy braku cytowań.'],
    guardrails: [
      ['Never publish, send, or post without the named approval.', 'Nigdy nie publikuj, nie wysyłaj ani nie zapisuj bez wskazanej akceptacji.'],
      ['Keep templates, policies, and source timestamps visible to the reviewer.', 'Pokazuj osobie sprawdzającej szablony, zasady i czas aktualizacji źródeł.'],
    ],
  },
  'investigate-and-report': {
    steps: [
      ['Collect source material from the approved systems and record its timestamp.', 'Zbiera materiały z zatwierdzonych systemów i zapisuje czas ich pozyskania.'],
      ['Cross-check conflicting signals and separate facts from inference.', 'Porównuje sprzeczne sygnały i oddziela fakty od wniosków.'],
      ['Prepare {{decision}} with citations, unknowns, and confidence.', 'Przygotowuje {{decision}} z cytowaniami, niewiadomymi i poziomem pewności.'],
      ['Deliver the approved report and preserve its evidence set.', 'Dostarcza zatwierdzony raport i zachowuje jego zestaw dowodów.'],
    ],
    risk: ['Missing or stale evidence can produce a confident but incomplete finding.', 'Brakujące lub nieaktualne dowody mogą dać pewne, ale niepełne ustalenie.'],
    mitigation: ['Show source coverage, conflicts, timestamps, and unanswered questions.', 'Pokazuj wykorzystane źródła, sprzeczności, daty danych i pytania bez odpowiedzi.'],
    guardrails: [
      ['Label inference separately from observed facts.', 'Oznaczaj wnioski oddzielnie od obserwowanych faktów.'],
      ['Do not close the investigation while required sources are unavailable.', 'Nie zamykaj dochodzenia, gdy wymagane źródła są niedostępne.'],
    ],
  },
  'reconcile-and-flag': {
    steps: [
      ['Normalize records and validate period, currency, and ownership.', 'Normalizuje rekordy i sprawdza okres, walutę oraz odpowiedzialność.'],
      ['Apply deterministic matching rules before model-assisted classification.', 'Stosuje deterministyczne reguły dopasowania przed klasyfikacją wspieraną modelem.'],
      ['Prepare a result covering {{decision}} and isolate every unresolved difference.', 'Przygotowuje wynik obejmujący {{decision}}; każdą niewyjaśnioną różnicę kieruje do sprawdzenia.'],
      ['Post only approved matches and retain the reconciliation evidence.', 'Zapisuje wyłącznie zatwierdzone dopasowania i zachowuje dowody uzgodnienia.'],
    ],
    risk: ['A plausible but incorrect match can hide a material difference.', 'Wiarygodne, lecz błędne dopasowanie może ukryć istotną różnicę.'],
    mitigation: ['Keep deterministic rules outside the model and require review above materiality thresholds.', 'Trzymaj jednoznaczne reguły poza modelem i wymagaj kontroli powyżej progów istotności.'],
    guardrails: [
      ['Never auto-clear unresolved or material differences.', 'Nigdy nie zamykaj automatycznie niewyjaśnionych lub istotnych różnic.'],
      ['Preserve source rows and match rationale in the audit trail.', 'Zachowuj rekordy źródłowe i uzasadnienie dopasowania w śladzie audytowym.'],
    ],
  },
  'monitor-and-alert': {
    steps: [
      ['Refresh the monitored signals and reject stale observations.', 'Odświeża monitorowane sygnały i odrzuca nieaktualne obserwacje.'],
      ['Compare the current state with the approved baseline and suppression rules.', 'Porównuje bieżący stan z zatwierdzonym punktem odniesienia i regułami wyciszania.'],
      ['Prepare {{decision}} with the threshold breach and supporting evidence.', 'Przygotowuje {{decision}} z przekroczonym progiem i dowodami.'],
      ['Create the approved alert or owned follow-up task.', 'Tworzy zatwierdzony alert lub przypisane zadanie do wykonania.'],
    ],
    risk: ['Noisy or stale signals can create alert fatigue and poor decisions.', 'Szum lub nieaktualne sygnały mogą powodować zmęczenie alertami i złe decyzje.'],
    mitigation: ['Calibrate thresholds by segment and track precision before enabling actions.', 'Kalibruj progi dla każdej grupy i mierz trafność przed uruchomieniem działań.'],
    guardrails: [
      ['Suppress alerts without fresh supporting evidence.', 'Wyciszaj alerty bez świeżych dowodów.'],
      ['Do not turn a risk score into an irreversible action.', 'Nie zamieniaj samej oceny ryzyka w nieodwracalne działanie.'],
    ],
  },
  'orchestrate-multi-step': {
    steps: [
      ['Build the dependency graph and verify every connector permission.', 'Buduje graf zależności i sprawdza uprawnienia każdego konektora.'],
      ['Coordinate read-only sub-steps and surface blocked dependencies.', 'Koordynuje kroki bez prawa zapisu i pokazuje zablokowane zależności.'],
      ['Prepare {{decision}} with state, exceptions, and rollback points.', 'Przygotowuje {{decision}} ze stanem, wyjątkami i punktami bezpiecznego wycofania.'],
      ['Execute approved sub-steps idempotently and verify the final state.', 'Wykonuje zatwierdzone podkroki idempotentnie i weryfikuje stan końcowy.'],
    ],
    risk: ['A partial multi-system execution can leave records in conflicting states.', 'Częściowe wykonanie w wielu systemach może pozostawić rekordy w sprzecznych stanach.'],
    mitigation: ['Use idempotency keys, checkpoints, and explicit compensation for every write step.', 'Stosuj klucze idempotencji, checkpointy i jawne działania kompensujące dla każdego zapisu.'],
    guardrails: [
      ['Pause when a dependency or approval is missing.', 'Zatrzymuj proces przy braku zależności lub akceptacji.'],
      ['Record before-and-after state for every system write.', 'Zapisuj stan przed i po każdym zapisie w systemie.'],
    ],
  },
  'auto-execute-with-guardrails': {
    steps: [
      ['Verify identity, entitlement, and the current policy version.', 'Weryfikuje tożsamość, uprawnienia i bieżącą wersję polityki.'],
      ['Simulate the requested action and calculate its bounded effects.', 'Symuluje żądaną akcję i oblicza jej ograniczone skutki.'],
      ['Prepare {{decision}} with side effects and rollback conditions.', 'Przygotowuje {{decision}} ze skutkami ubocznymi i warunkami wycofania.'],
      ['Execute the approved action, verify the result, and log the change.', 'Wykonuje zatwierdzoną akcję, weryfikuje wynik i zapisuje zmianę.'],
    ],
    risk: ['An incorrect or over-scoped action can change a material record.', 'Błędna lub zbyt szeroka akcja może zmienić istotny rekord.'],
    mitigation: ['Use least-privilege tools, dry runs, hard limits, and post-action verification.', 'Stosuj minimalne uprawnienia, próbne wykonanie, twarde limity i kontrolę po działaniu.'],
    guardrails: [
      ['Block execution when identity, evidence, or rollback conditions are incomplete.', 'Blokuj wykonanie przy niepełnej tożsamości, dowodach lub warunkach wycofania.'],
      ['Require fresh approval for irreversible or high-value actions.', 'Wymagaj świeżej akceptacji dla akcji nieodwracalnych lub wysokiej wartości.'],
    ],
  },
} satisfies Record<AgentWorkflowArchetype, {
  steps: Pair[]
  risk: Pair
  mitigation: Pair
  guardrails: Pair[]
}>

function compact(specs: CompactSpec[]): Blueprint[] {
  return specs.map((spec) => {
    const pattern = compactPatterns[spec.archetype]
    const steps = pattern.steps.map(([en, pl]) => [
      en.replace('{{decision}}', spec.decision[0]),
      pl.replace('{{decision}}', spec.decision[1]),
    ] as Pair)

    return {
    slug: spec.slug,
    title: spec.title,
    oneLiner: spec.oneLiner,
    category: spec.category,
    department: spec.department,
    archetype: spec.archetype,
    contexts: spec.contexts,
    primaryUser: spec.primaryUser,
    benefit: spec.benefit,
    complexity: spec.complexity,
    capabilities: spec.capabilities,
    beforeAgentic: spec.beforeAgentic,
    whyAgentic: spec.whyAgentic,
    industries: spec.industries,
    companySizes: spec.riskLevel === 'high' ? ['medium', 'enterprise'] : ['small', 'medium', 'enterprise'],
    difficulty: spec.riskLevel === 'high' ? 'high' : 'medium',
    maturity: spec.maturity,
    riskLevel: spec.riskLevel,
    weeks: spec.riskLevel === 'high' ? [8, 16] : [4, 8],
    trigger: spec.trigger,
    inputs: [
      [`Process context: ${spec.subject[0]}`, `Kontekst procesu: ${spec.subject[1]}`],
      [`Approved policies, ownership, and exception rules`, `Zatwierdzone zasady, odpowiedzialność i reguły wyjątków`],
    ],
    steps,
    checkpoint: [`The accountable process owner approves ${spec.decision[0]}.`, `Osoba odpowiedzialna za proces zatwierdza ${spec.decision[1]}.`],
    outputs: [spec.output, ['Evidence, exceptions, and audit trail', 'Dowody, wyjątki i ślad audytowy']],
    minimumStack: spec.category === 'legal-compliance' || spec.category === 'insurance' ? commonStack.documents : commonStack.operations,
    tools: [
      [spec.system, [`Provides the system of record and bounded write actions.`, `Dostarcza główne dane procesu i ograniczone możliwości zapisu.`]],
      ['Review queue', [`Captures approval, rejection, and rationale.`, `Rejestruje akceptację, odrzucenie i uzasadnienie.`]],
    ],
    risk: pattern.risk,
    mitigation: pattern.mitigation,
    guardrails: pattern.guardrails,
    impact: [
      spec.impact[0],
      spec.impact[1],
      spec.impact[2],
      spec.impact[3],
      spec.impact[4],
      spec.impactExplanation ?? [
        'A bounded planning range for the named operational KPI; validate it against a pre-deployment baseline.',
        'Ostrożny zakres planistyczny dla wskazanego miernika; zweryfikuj go względem wyniku sprzed wdrożenia.',
      ],
    ],
    sourceKeys: spec.sourceKeys,
    }
  })
}

type ExpansionSpec = {
  slug: string
  title: Pair
  oneLiner: Pair
  category: AgentWorkflowCategory
  contexts: WorkflowContext[]
  primaryUser: Pair
  benefit: Pair
  complexity: 1 | 2 | 3 | 4 | 5
  capabilities: WorkflowCapability[]
  archetype: AgentWorkflowArchetype
  industries: string[]
  trigger: Pair
  subject: Pair
  decision: Pair
  output: Pair
  system: string
  sourceKeys: SourceKey[]
}

function expand(specs: ExpansionSpec[]): Blueprint[] {
  return compact(
    specs.map((spec) => ({
      ...spec,
      department: spec.primaryUser,
      riskLevel: spec.complexity >= 4 ? 'high' : spec.complexity === 3 ? 'medium' : 'low',
      maturity: spec.complexity <= 2 ? 'proven' : 'emerging',
      impact: [
        15,
        spec.complexity >= 4 ? 35 : 45,
        ['Reduction in manual handling time', 'Spadek czasu ręcznej obsługi'],
        'editorial_estimate',
        'low',
      ],
    })),
  )
}

const blueprints: Blueprint[] = [
  {
    slug: 'website-intent-to-qualified-crm-lead',
    title: ['Website intent to qualified CRM lead', 'Intencja na stronie do kwalifikowanego leada CRM'],
    oneLiner: [
      'Detect buying signals, enrich the account, and route a review-ready lead to the right owner.',
      'Wykrywa sygnały zakupu, wzbogaca konto i kieruje gotowego do przeglądu leada do właściwego ownera.',
    ],
    category: 'sales',
    department: ['Revenue operations', 'Revenue operations'],
    archetype: 'enrich-and-route',
    industries: ['B2B software', 'professional services'],
    companySizes: ['medium', 'enterprise'],
    difficulty: 'medium',
    maturity: 'proven',
    riskLevel: 'medium',
    weeks: [4, 8],
    trigger: ['A high-intent visitor submits a form or crosses an account-intent threshold.', 'Użytkownik o wysokiej intencji wysyła formularz lub konto przekracza próg intent.'],
    inputs: [['Page and form activity', 'Aktywność stron i formularzy'], ['CRM account and territory data', 'Dane konta i terytorium w CRM']],
    steps: [['Resolve visitor to account.', 'Łączy użytkownika z kontem.'], ['Enrich firmographic and intent context.', 'Wzbogaca kontekst firmograficzny i intent.'], ['Score fit and recommend owner with evidence.', 'Ocenia dopasowanie i rekomenduje ownera z dowodami.'], ['Create the approved lead and notify the owner.', 'Tworzy zaakceptowanego leada i powiadamia ownera.']],
    checkpoint: ['RevOps approves score, routing, and consent basis.', 'RevOps zatwierdza scoring, routing i podstawę zgody.'],
    outputs: [['Qualified CRM lead', 'Kwalifikowany lead CRM'], ['Routing rationale and audit trail', 'Uzasadnienie routingu i ślad audytowy']],
    minimumStack: commonStack.crm,
    tools: [['Salesforce', ['Stores lead, account, and owner data.', 'Przechowuje dane leada, konta i ownera.']], ['Clearbit', ['Enriches company attributes.', 'Wzbogaca atrybuty firmy.']]],
    risk: ['Anonymous visitors may be misidentified or over-scored.', 'Anonimowi użytkownicy mogą być błędnie rozpoznani lub zawyżeni.'],
    mitigation: ['Require deterministic identifiers and expose every scoring signal.', 'Wymagaj deterministycznych identyfikatorów i pokazuj każdy sygnał scoringu.'],
    guardrails: [['Never create outreach without a lawful contact basis.', 'Nie twórz outreachu bez legalnej podstawy kontaktu.'], ['Route low-confidence matches to manual review.', 'Kieruj dopasowania o niskiej pewności do ręcznego przeglądu.']],
    impact: [10, 25, ['Increase in sales-accepted lead rate', 'Wzrost odsetka leadów zaakceptowanych przez sprzedaż'], 'editorial_estimate', 'medium', ['A directional planning range; baseline traffic quality and routing discipline dominate the result.', 'Kierunkowy zakres planistyczny; wynik zależy głównie od jakości ruchu i dyscypliny routingu.']],
    sourceKeys: ['salesforceSales'],
  },
  ...compact([
    { slug: 'event-attendee-concierge', title: ['Event attendee concierge', 'Concierge uczestnika wydarzenia'], oneLiner: ['Answer grounded event questions and execute approved registration changes.', 'Odpowiada na pytania o wydarzenie i wykonuje dozwolone zmiany rejestracji.'], category: 'customer-support', department: ['Events', 'Wydarzenia'], archetype: 'auto-execute-with-guardrails', industries: ['events', 'media'], riskLevel: 'medium', maturity: 'proven', trigger: ['An attendee asks a question or requests a registration change.', 'Uczestnik zadaje pytanie lub prosi o zmianę rejestracji.'], subject: ['attendee, agenda, and entitlement data', 'dane uczestnika, agendy i uprawnień'], decision: ['a grounded answer or allowed registration action', 'opartą na źródłach odpowiedź lub dozwoloną akcję rejestracji'], output: ['Resolved request or staffed escalation', 'Rozwiązane zgłoszenie lub eskalacja do obsługi'], system: 'Salesforce', impact: [15, 35, ['Reduction in staffed attendee requests', 'Spadek zgłoszeń uczestników obsługiwanych przez ludzi'], 'vendor_report', 'low'], sourceKeys: ['salesforceEvents'] },
    { slug: 'multi-brand-voice-support', title: ['Multi-brand voice support', 'Obsługa wielu głosów marek'], oneLiner: ['Resolve routine requests while enforcing brand-specific policy and tone.', 'Rozwiązuje rutynowe zgłoszenia z zachowaniem polityki i tonu konkretnej marki.'], category: 'customer-support', department: ['Customer service', 'Obsługa klienta'], archetype: 'auto-execute-with-guardrails', industries: ['retail', 'consumer services'], riskLevel: 'medium', maturity: 'proven', trigger: ['A customer opens a supported messaging conversation.', 'Klient rozpoczyna rozmowę w obsługiwanym kanale.'], subject: ['customer identity, brand, policy, and conversation data', 'dane klienta, marki, polityki i rozmowy'], decision: ['a policy-grounded response and disposition', 'odpowiedź i dyspozycję zgodną z polityką'], output: ['Resolved conversation with brand-consistent response', 'Rozwiązana rozmowa z odpowiedzią zgodną z marką'], system: 'Intercom', impact: [15, 40, ['Reduction in human-handled routine conversations', 'Spadek rutynowych rozmów obsługiwanych przez ludzi'], 'vendor_report', 'medium'], sourceKeys: ['salesforceService', 'telus'] },
    { slug: 'multi-expert-ecommerce-support', title: ['Multi-expert ecommerce support', 'Wieloekspercka obsługa ecommerce'], oneLiner: ['Route order, product, policy, and loyalty questions to specialized agents under one case.', 'Kieruje pytania o zamówienie, produkt, politykę i lojalność do wyspecjalizowanych agentów w jednej sprawie.'], category: 'customer-support', department: ['Ecommerce support', 'Wsparcie ecommerce'], archetype: 'orchestrate-multi-step', industries: ['ecommerce', 'retail'], riskLevel: 'medium', maturity: 'emerging', trigger: ['A customer request spans more than one support domain.', 'Zgłoszenie klienta obejmuje więcej niż jedną domenę wsparcia.'], subject: ['order, catalog, policy, and loyalty context', 'kontekst zamówienia, katalogu, polityki i lojalności'], decision: ['a coordinated resolution plan', 'skoordynowany plan rozwiązania'], output: ['Single coherent resolution and case log', 'Jedno spójne rozwiązanie i log sprawy'], system: 'Salesforce Service Cloud', impact: [10, 30, ['Reduction in transfers between support queues', 'Spadek transferów między kolejkami wsparcia'], 'vendor_report', 'low'], sourceKeys: ['salesforceService'] },
    { slug: 'specialist-support-swarm', title: ['Specialist support swarm', 'Swarm specjalistów wsparcia'], oneLiner: ['Assemble billing, technical, and policy evidence before escalating one complex case.', 'Zbiera dowody billingowe, techniczne i polityki przed eskalacją złożonej sprawy.'], category: 'customer-support', department: ['Escalations', 'Eskalacje'], archetype: 'orchestrate-multi-step', industries: ['telecommunications', 'financial services', 'software'], riskLevel: 'high', maturity: 'emerging', trigger: ['A case breaches complexity, sentiment, or retry thresholds.', 'Sprawa przekracza próg złożoności, sentymentu lub ponownych prób.'], subject: ['case history and specialist system evidence', 'historię sprawy i dowody z systemów specjalistycznych'], decision: ['a specialist-backed resolution for senior review', 'rozwiązanie oparte na ustaleniach specjalistów do senior review'], output: ['Unified escalation packet', 'Ujednolicony pakiet eskalacyjny'], system: 'ServiceNow', impact: [15, 35, ['Reduction in complex-case resolution time', 'Spadek czasu rozwiązania złożonych spraw'], 'vendor_report', 'low'], sourceKeys: ['telus', 'salesforceService'] },
    { slug: 'travel-cancellation-and-rebooking', title: ['Travel cancellation and rebooking', 'Anulowanie i zmiana rezerwacji podróży'], oneLiner: ['Assess disruption options and execute only traveler-approved itinerary changes.', 'Ocenia opcje przy zakłóceniu i wykonuje wyłącznie zaakceptowane przez podróżnego zmiany planu.'], category: 'customer-support', department: ['Travel operations', 'Operacje podróży'], archetype: 'auto-execute-with-guardrails', industries: ['travel', 'hospitality'], riskLevel: 'high', maturity: 'emerging', trigger: ['A cancellation, delay, or traveler change request is received.', 'Wpływa anulowanie, opóźnienie lub prośba podróżnego o zmianę.'], subject: ['itinerary, fare rules, inventory, and traveler preferences', 'plan podróży, reguły taryfy, dostępność i preferencje podróżnego'], decision: ['ranked compliant alternatives and total cost', 'ranking zgodnych alternatyw i całkowity koszt'], output: ['Confirmed traveler-approved itinerary or escalation', 'Potwierdzony plan zaakceptowany przez podróżnego lub eskalacja'], system: 'Travelport', impact: [20, 45, ['Reduction in manual disruption-handling time', 'Spadek ręcznego czasu obsługi zakłóceń'], 'editorial_estimate', 'low'], sourceKeys: ['xRiley'] },
    { slug: 'it-hr-case-resolution', title: ['IT and HR case resolution', 'Rozwiązywanie spraw IT i HR'], oneLiner: ['Resolve policy-grounded employee requests across identity, HR, and IT systems.', 'Rozwiązuje oparte na politykach zgłoszenia pracowników w systemach identity, HR i IT.'], category: 'customer-support', department: ['Employee services', 'Usługi pracownicze'], archetype: 'orchestrate-multi-step', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['An authenticated employee submits an IT or HR request.', 'Uwierzytelniony pracownik wysyła zgłoszenie IT lub HR.'], subject: ['employee identity, policy, entitlement, and case data', 'tożsamość, politykę, uprawnienia i dane sprawy pracownika'], decision: ['a policy-compliant resolution or specialist escalation', 'rozwiązanie zgodne z polityką lub eskalację do specjalisty'], output: ['Resolved employee case with audit history', 'Rozwiązana sprawa pracownika z historią audytową'], system: 'Microsoft Copilot Studio', impact: [15, 35, ['Reduction in manually handled employee cases', 'Spadek spraw pracowniczych obsługiwanych ręcznie'], 'case_study', 'medium'], sourceKeys: ['microsoftCopilot', 'workday'] },

    { slug: 'brief-to-cms-campaign', title: ['Brief to CMS campaign', 'Brief do kampanii CMS'], oneLiner: ['Turn an approved brief into channel-ready CMS assets with staged review.', 'Zamienia zatwierdzony brief w gotowe do kanałów assety CMS z etapowym przeglądem.'], category: 'marketing', department: ['Content operations', 'Content operations'], archetype: 'draft-and-approve', industries: ['retail', 'media', 'B2B software'], riskLevel: 'medium', maturity: 'proven', trigger: ['A campaign brief reaches approved status.', 'Brief kampanii osiąga status zatwierdzony.'], subject: ['brief, brand rules, source assets, and channel requirements', 'brief, zasady marki, assety źródłowe i wymagania kanałów'], decision: ['channel drafts and CMS field mappings', 'drafty kanałów i mapowanie pól CMS'], output: ['Approved staged campaign package', 'Zaakceptowany pakiet kampanii w stagingu'], system: 'Contentful', impact: [25, 50, ['Reduction in campaign production time', 'Spadek czasu produkcji kampanii'], 'case_study', 'medium'], sourceKeys: ['gradial'] },
    { slug: 'transcript-to-content-campaign', title: ['Transcript to content campaign', 'Transkrypt do kampanii contentowej'], oneLiner: ['Extract approved claims from a transcript and repurpose them into linked campaign assets.', 'Wyciąga zatwierdzone tezy z transkryptu i przerabia je na powiązane assety kampanii.'], category: 'marketing', department: ['Content marketing', 'Content marketing'], archetype: 'draft-and-approve', industries: ['media', 'education', 'B2B software'], riskLevel: 'medium', maturity: 'proven', trigger: ['A reviewed webinar, interview, or podcast transcript is published internally.', 'Wewnętrznie publikowany jest sprawdzony transkrypt webinaru, wywiadu lub podcastu.'], subject: ['speaker-attributed transcript and usage rights', 'transkrypt z mówcami i prawa użycia'], decision: ['claim-level excerpts and channel drafts', 'fragmenty na poziomie tez i drafty kanałów'], output: ['Cited multi-channel content pack', 'Cytowany wielokanałowy pakiet contentu'], system: 'HubSpot', impact: [30, 60, ['Reduction in repurposing production time', 'Spadek czasu produkcji repurposingu'], 'editorial_estimate', 'medium'], sourceKeys: ['gradial', 'xRiley'] },
    { slug: 'accessibility-seo-remediation', title: ['Accessibility and SEO remediation', 'Remediacja accessibility i SEO'], oneLiner: ['Scan changed pages, propose bounded fixes, and open reviewable CMS or code diffs.', 'Skanuje zmienione strony, proponuje ograniczone poprawki i otwiera kontrolowane diffy CMS lub kodu.'], category: 'marketing', department: ['Web operations', 'Web operations'], archetype: 'draft-and-approve', industries: ['cross-industry'], riskLevel: 'medium', maturity: 'emerging', trigger: ['A page is published or a scheduled quality scan finds a regression.', 'Strona jest publikowana lub cykliczny skan wykrywa regresję.'], subject: ['rendered page, accessibility findings, and SEO metadata', 'wyrenderowaną stronę, ustalenia accessibility i metadata SEO'], decision: ['a prioritized remediation diff', 'priorytetowy diff remediacji'], output: ['Reviewable CMS or pull-request changes', 'Kontrolowane zmiany CMS lub pull request'], system: 'GitHub', impact: [20, 45, ['Reduction in remediation preparation time', 'Spadek czasu przygotowania remediacji'], 'editorial_estimate', 'medium'], sourceKeys: ['gradial'] },
    { slug: 'brand-compliance-review', title: ['Brand compliance review', 'Przegląd zgodności z marką'], oneLiner: ['Compare campaign assets with approved claims, tone, and visual rules before release.', 'Porównuje assety kampanii z zatwierdzonymi tezami, tonem i regułami wizualnymi przed publikacją.'], category: 'marketing', department: ['Brand operations', 'Brand operations'], archetype: 'investigate-and-report', industries: ['retail', 'consumer goods', 'financial services'], riskLevel: 'medium', maturity: 'proven', trigger: ['A campaign package enters pre-publication review.', 'Pakiet kampanii wchodzi do przeglądu przed publikacją.'], subject: ['campaign assets, brand rules, and approved claims', 'assety kampanii, zasady marki i zatwierdzone tezy'], decision: ['a cited pass, fix, or escalate recommendation', 'cytowaną rekomendację pass, fix lub escalate'], output: ['Brand compliance report and bounded fixes', 'Raport zgodności marki i ograniczone poprawki'], system: 'Adobe Experience Manager', impact: [15, 35, ['Reduction in first-pass brand review time', 'Spadek czasu pierwszego przeglądu marki'], 'vendor_report', 'low'], sourceKeys: ['gradial', 'danone'] },
    { slug: 'campaign-performance-exception-monitor', title: ['Campaign performance exception monitor', 'Monitor wyjątków performance kampanii'], oneLiner: ['Watch approved KPI thresholds, explain anomalies, and propose reversible campaign changes.', 'Monitoruje zatwierdzone progi KPI, wyjaśnia anomalie i proponuje odwracalne zmiany kampanii.'], category: 'marketing', department: ['Growth marketing', 'Growth marketing'], archetype: 'monitor-and-alert', industries: ['ecommerce', 'B2B software'], riskLevel: 'high', maturity: 'emerging', trigger: ['A campaign KPI crosses a configured threshold for the required window.', 'KPI kampanii przekracza skonfigurowany próg w wymaganym oknie.'], subject: ['campaign metrics, spend, creative, and experiment history', 'metryki kampanii, spend, kreacje i historię eksperymentów'], decision: ['a cause-ranked reversible intervention', 'uszeregowaną przyczynowo odwracalną interwencję'], output: ['Approved budget, audience, or creative change', 'Zaakceptowana zmiana budżetu, audience lub kreacji'], system: 'Google Ads', impact: [10, 25, ['Reduction in time-to-detect material campaign anomalies', 'Spadek czasu wykrycia istotnych anomalii kampanii'], 'editorial_estimate', 'low'], sourceKeys: ['xKaxil'] },

    { slug: 'contract-to-finance-data', title: ['Contract to finance data', 'Umowa do danych finansowych'], oneLiner: ['Extract cited billing and revenue terms overnight for expert validation.', 'Ekstrahuje nocą cytowane warunki billingowe i revenue do walidacji eksperta.'], category: 'finance', department: ['Revenue accounting', 'Revenue accounting'], archetype: 'draft-and-approve', industries: ['cross-industry'], riskLevel: 'high', maturity: 'scaled', trigger: ['A signed contract or amendment enters the finance intake folder.', 'Podpisana umowa lub aneks trafia do folderu intake finansów.'], subject: ['contract pages, amendments, and accounting policy', 'strony umowy, aneksy i politykę księgową'], decision: ['structured terms and non-standard flags', 'ustrukturyzowane warunki i flagi niestandardowe'], output: ['Validated contract-data record with citations', 'Zweryfikowany rekord danych umowy z cytatami'], system: 'Snowflake', impact: [40, 50, ['Reduction in contract review turnaround', 'Spadek czasu przeglądu umowy'], 'case_study', 'medium'], impactExplanation: ['The source reports a 50% turnaround reduction; 40–50% is a conservative pilot-calibration range, not a measured interval.', 'Źródło raportuje skrócenie czasu o 50%; 40–50% to konserwatywny zakres kalibracji pilota, a nie zmierzony przedział.'], sourceKeys: ['contractAgent'] },
    { slug: 'procurement-intake-orchestration', title: ['Procurement intake orchestration', 'Orkiestracja intake procurement'], oneLiner: ['Classify a purchase request, collect missing evidence, and route the right approval path.', 'Klasyfikuje wniosek zakupowy, zbiera brakujące dowody i kieruje właściwą ścieżką akceptacji.'], category: 'finance', department: ['Procurement', 'Procurement'], archetype: 'orchestrate-multi-step', industries: ['cross-industry'], riskLevel: 'high', maturity: 'emerging', trigger: ['A new purchase or vendor request is submitted.', 'Wpływa nowy wniosek zakupowy lub vendor request.'], subject: ['request, vendor, budget, security, and legal data', 'wniosek, vendora, budżet, security i dane prawne'], decision: ['the complete approval route and exception list', 'pełną ścieżkę akceptacji i listę wyjątków'], output: ['Complete procurement case with assigned approvals', 'Kompletna sprawa procurement z przypisanymi akceptacjami'], system: 'Coupa', impact: [15, 35, ['Reduction in procurement intake cycle time', 'Spadek czasu cyklu intake procurement'], 'research', 'medium'], sourceKeys: ['pwcFinance', 'contractAgent'] },
    { slug: 'invoice-processing-and-exception-routing', title: ['Invoice processing and exception routing', 'Przetwarzanie faktur i routing wyjątków'], oneLiner: ['Extract invoices, match records, and route only genuine exceptions to AP.', 'Ekstrahuje faktury, dopasowuje rekordy i kieruje do AP tylko rzeczywiste wyjątki.'], category: 'finance', department: ['Accounts payable', 'Accounts payable'], archetype: 'reconcile-and-flag', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['An invoice arrives in an approved AP channel.', 'Faktura wpływa zatwierdzonym kanałem AP.'], subject: ['invoice, purchase order, receipt, vendor, and tax data', 'fakturę, purchase order, odbiór, vendora i dane podatkowe'], decision: ['a three-way match or coded exception', 'three-way match lub zakodowany wyjątek'], output: ['Posting-ready invoice or owned exception', 'Faktura gotowa do księgowania lub przypisany wyjątek'], system: 'SAP', impact: [20, 45, ['Reduction in manual invoice touches', 'Spadek ręcznych interakcji z fakturą'], 'vendor_report', 'medium'], sourceKeys: ['pwcFinance', 'basis'] },
    { slug: 'order-price-discrepancy-resolution', title: ['Invoice price-exception investigation', 'Dochodzenie wyjątku cenowego faktury'], oneLiner: ['Run as the specialist sub-workflow after a three-way match fails, reconciling contracted, ordered, received, and invoiced prices.', 'Działa jako specjalistyczny sub-workflow po nieudanym three-way match i uzgadnia ceny umowne, zamówione, odebrane oraz zafakturowane.'], category: 'finance', department: ['Accounts payable', 'Accounts payable'], archetype: 'reconcile-and-flag', industries: ['manufacturing', 'retail'], riskLevel: 'high', maturity: 'proven', trigger: ['A three-way match fails specifically on price or quantity.', 'Three-way match nie przechodzi konkretnie dla ceny lub ilości.'], subject: ['contract, PO, receipt, invoice, and tolerance rules', 'umowę, PO, odbiór, fakturę i reguły tolerancji'], decision: ['a cited root cause and permitted resolution', 'cytowaną przyczynę źródłową i dozwolone rozwiązanie'], output: ['Resolved discrepancy or vendor-owner task', 'Rozwiązana rozbieżność lub zadanie dla ownera vendora'], system: 'SAP', impact: [15, 35, ['Reduction in AP exception handling time', 'Spadek czasu obsługi wyjątków AP'], 'research', 'medium'], sourceKeys: ['pwcFinance'] },
    { slug: 'bank-reconciliation-preparation', title: ['Bank reconciliation preparation', 'Przygotowanie uzgodnienia bankowego'], oneLiner: ['Match bank activity to ledger entries and present unexplained differences for approval.', 'Dopasowuje aktywność bankową do księgi i przedstawia niewyjaśnione różnice do akceptacji.'], category: 'finance', department: ['Accounting', 'Księgowość'], archetype: 'reconcile-and-flag', industries: ['cross-industry'], riskLevel: 'high', maturity: 'scaled', trigger: ['A daily or month-end bank statement is available.', 'Dostępny jest dzienny lub miesięczny wyciąg bankowy.'], subject: ['bank transactions, ledger, rules, and prior explanations', 'transakcje bankowe, ledger, reguły i wcześniejsze wyjaśnienia'], decision: ['matches, proposed classifications, and exceptions', 'dopasowania, proponowane klasyfikacje i wyjątki'], output: ['Reviewable reconciliation package', 'Pakiet uzgodnienia gotowy do przeglądu'], system: 'NetSuite', impact: [15, 30, ['Reduction in accounting workflow time', 'Spadek czasu procesów księgowych'], 'case_study', 'medium'], impactExplanation: ['The source reports savings of up to 30%; 15–30% is a planning range that must be validated against the local close process.', 'Źródło raportuje oszczędność do 30%; 15–30% to zakres planistyczny do weryfikacji względem lokalnego procesu close.'], sourceKeys: ['basis'] },
    { slug: 'close-exception-monitor', title: ['Month-end close exception monitor', 'Monitor wyjątków month-end close'], oneLiner: ['Watch close dependencies, explain blocked tasks, and escalate material exceptions.', 'Monitoruje zależności close, wyjaśnia zablokowane zadania i eskaluje istotne wyjątki.'], category: 'finance', department: ['Controllership', 'Controllership'], archetype: 'monitor-and-alert', industries: ['cross-industry'], riskLevel: 'high', maturity: 'emerging', trigger: ['A close task misses a dependency, threshold, or due time.', 'Zadanie close nie spełnia zależności, progu lub terminu.'], subject: ['close checklist, ledger status, dependencies, and materiality', 'checklistę close, status księgi, zależności i materiality'], decision: ['a cause-ranked exception and accountable owner', 'uszeregowany wyjątek i odpowiedzialnego ownera'], output: ['Prioritized close exception queue', 'Priorytetowa kolejka wyjątków close'], system: 'BlackLine', impact: [10, 25, ['Reduction in late close-task resolution time', 'Spadek czasu rozwiązania opóźnionych zadań close'], 'research', 'medium'], sourceKeys: ['pwcFinance', 'basis'] },
    { slug: 'variance-reporting-with-evidence', title: ['Variance reporting with evidence', 'Raportowanie odchyleń z dowodami'], oneLiner: ['Explain material plan-versus-actual variances from connected finance evidence.', 'Wyjaśnia istotne odchylenia plan-versus-actual na podstawie połączonych dowodów finansowych.'], category: 'finance', department: ['FP&A', 'FP&A'], archetype: 'investigate-and-report', industries: ['cross-industry'], riskLevel: 'high', maturity: 'emerging', trigger: ['A reporting period closes or a material variance threshold is crossed.', 'Zamyka się okres raportowy lub przekroczony zostaje próg istotnego odchylenia.'], subject: ['actuals, plan, forecast, operational drivers, and commentary', 'actuals, plan, forecast, drivery operacyjne i komentarze'], decision: ['a cited variance explanation and open questions', 'cytowane wyjaśnienie odchylenia i otwarte pytania'], output: ['Reviewer-approved variance narrative', 'Narracja odchyleń zaakceptowana przez reviewera'], system: 'Anaplan', impact: [15, 35, ['Reduction in variance-analysis preparation time', 'Spadek czasu przygotowania analizy odchyleń'], 'research', 'medium'], sourceKeys: ['pwcFinance', 'danone'] },
    { slug: 'payment-exception-resolution', title: ['Payment exception resolution', 'Rozwiązywanie wyjątków płatności'], oneLiner: ['Investigate failed or held payments and propose a policy-compliant next action.', 'Bada nieudane lub wstrzymane płatności i proponuje zgodną z polityką kolejną akcję.'], category: 'finance', department: ['Payments', 'Płatności'], archetype: 'investigate-and-report', industries: ['financial services', 'ecommerce'], riskLevel: 'high', maturity: 'proven', trigger: ['A payment fails, is held, or breaches an exception threshold.', 'Płatność nie przechodzi, zostaje wstrzymana lub przekracza próg wyjątku.'], subject: ['payment event, account, fraud, sanctions, and ledger evidence', 'zdarzenie płatności, konto, fraud, sankcje i dowody ledger'], decision: ['a permitted retry, return, hold, or escalation', 'dozwolony retry, zwrot, hold lub eskalację'], output: ['Approved payment disposition and customer task', 'Zaakceptowana dyspozycja płatności i zadanie klienta'], system: 'Stripe', impact: [15, 35, ['Reduction in payment exception handling time', 'Spadek czasu obsługi wyjątków płatności'], 'vendor_report', 'medium'], sourceKeys: ['gradient', 'pwcFinance'] },
    { slug: 'investor-relations-preparation', title: ['Investor relations preparation', 'Przygotowanie investor relations'], oneLiner: ['Assemble cited performance context, anticipated questions, and draft responses for IR review.', 'Składa cytowany kontekst wyników, przewidywane pytania i drafty odpowiedzi do przeglądu IR.'], category: 'finance', department: ['Investor relations', 'Investor relations'], archetype: 'draft-and-approve', industries: ['public companies', 'financial services'], riskLevel: 'high', maturity: 'emerging', trigger: ['An earnings, board, or investor meeting enters the preparation window.', 'Spotkanie earnings, board lub inwestorskie wchodzi w okno przygotowania.'], subject: ['approved financials, disclosures, prior Q&A, and market research', 'zatwierdzone dane finansowe, disclosures, wcześniejsze Q&A i research rynkowy'], decision: ['cited talking points and likely-question drafts', 'cytowane talking points i drafty prawdopodobnych pytań'], output: ['Approved IR preparation book', 'Zaakceptowany pakiet przygotowania IR'], system: 'Microsoft 365', impact: [20, 40, ['Reduction in IR preparation time', 'Spadek czasu przygotowania IR'], 'research', 'low'], sourceKeys: ['auquan', 'danone'] },

    { slug: 'candidate-screening-and-scheduling', title: ['Candidate screening and scheduling', 'Screening i planowanie kandydatów'], oneLiner: ['Apply an approved rubric, explain evidence, and schedule only recruiter-approved candidates.', 'Stosuje zatwierdzoną rubrykę, wyjaśnia dowody i planuje tylko kandydatów zaakceptowanych przez rekrutera.'], category: 'people', department: ['Talent acquisition', 'Talent acquisition'], archetype: 'enrich-and-route', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['A complete application enters an open requisition.', 'Kompletna aplikacja trafia do otwartej rekrutacji.'], subject: ['application, job rubric, work authorization, and availability', 'aplikację, rubrykę stanowiska, prawo do pracy i dostępność'], decision: ['a rubric-based recommendation without protected traits', 'rekomendację opartą na rubryce bez cech chronionych'], output: ['Recruiter-reviewed shortlist and interview slots', 'Lista po review rekrutera i terminy rozmów'], system: 'Workday', impact: [20, 45, ['Reduction in recruiter administration time', 'Spadek czasu administracyjnego rekrutera'], 'vendor_report', 'medium'], sourceKeys: ['workday', 'danone'] },
    { slug: 'frontline-hiring-orchestration', title: ['Frontline hiring orchestration', 'Orkiestracja rekrutacji frontline'], oneLiner: ['Coordinate high-volume eligibility, messaging, interviews, and document collection.', 'Koordynuje wysokonakładową weryfikację, komunikację, rozmowy i zbieranie dokumentów.'], category: 'people', department: ['High-volume recruiting', 'Rekrutacja masowa'], archetype: 'orchestrate-multi-step', industries: ['retail', 'hospitality', 'logistics'], riskLevel: 'high', maturity: 'proven', trigger: ['A candidate applies to an approved frontline requisition.', 'Kandydat aplikuje na zatwierdzone stanowisko frontline.'], subject: ['application, location rules, shift needs, and hiring stages', 'aplikację, reguły lokalizacji, potrzeby zmian i etapy rekrutacji'], decision: ['an eligible next stage or human exception', 'kwalifikujący kolejny etap lub wyjątek dla człowieka'], output: ['Completed hiring stage with candidate consent log', 'Ukończony etap rekrutacji z logiem zgód kandydata'], system: 'Workday', impact: [20, 45, ['Reduction in hiring-process administration time', 'Spadek czasu administracji procesu rekrutacji'], 'case_study', 'medium'], sourceKeys: ['workday'] },
    { slug: 'promotion-change-workflow', title: ['Promotion and employee-change workflow', 'Proces awansu i zmian pracowniczych'], oneLiner: ['Validate policy, budget, approvals, and downstream changes before an employee action.', 'Waliduje politykę, budżet, akceptacje i zmiany downstream przed akcją pracowniczą.'], category: 'people', department: ['People operations', 'People operations'], archetype: 'orchestrate-multi-step', industries: ['cross-industry'], riskLevel: 'high', maturity: 'emerging', trigger: ['A manager submits a promotion, transfer, or compensation change.', 'Manager składa wniosek o awans, transfer lub zmianę wynagrodzenia.'], subject: ['employee record, compensation bands, budget, policy, and approvals', 'rekord pracownika, widełki, budżet, politykę i akceptacje'], decision: ['a compliant change package and exception route', 'zgodny pakiet zmiany i ścieżkę wyjątków'], output: ['Approved effective-dated employee change', 'Zaakceptowana zmiana pracownicza z datą wejścia'], system: 'Workday', impact: [15, 30, ['Reduction in employee-change cycle time', 'Spadek czasu cyklu zmian pracowniczych'], 'research', 'medium'], sourceKeys: ['workday', 'microsoftCopilot'] },
    { slug: 'employee-policy-case-triage', title: ['Employee policy case triage', 'Triaging spraw polityk pracowniczych'], oneLiner: ['Ground employee questions in current policy and route sensitive cases to the right specialist.', 'Opiera pytania pracowników na aktualnej polityce i kieruje wrażliwe sprawy do właściwego specjalisty.'], category: 'people', department: ['HR service delivery', 'HR service delivery'], archetype: 'enrich-and-route', industries: ['cross-industry'], riskLevel: 'high', maturity: 'scaled', trigger: ['An authenticated employee asks a policy or benefit question.', 'Uwierzytelniony pracownik pyta o politykę lub benefit.'], subject: ['employee context, effective policy, jurisdiction, and case history', 'kontekst pracownika, obowiązującą politykę, jurysdykcję i historię sprawy'], decision: ['a cited answer or confidential specialist route', 'cytowaną odpowiedź lub poufny routing do specjalisty'], output: ['Grounded answer or owned HR case', 'Oparta na źródłach odpowiedź lub przypisana sprawa HR'], system: 'Microsoft Copilot Studio', impact: [15, 35, ['Reduction in manually handled policy questions', 'Spadek ręcznie obsługiwanych pytań o politykę'], 'case_study', 'medium'], sourceKeys: ['microsoftCopilot', 'workday'] },

    { slug: 'legal-playbook-review', title: ['Legal playbook review', 'Przegląd według legal playbook'], oneLiner: ['Compare incoming terms with an approved playbook and draft cited redlines for lawyer review.', 'Porównuje warunki z zatwierdzonym playbookiem i tworzy cytowane redline do przeglądu prawnika.'], category: 'legal-compliance', department: ['Commercial legal', 'Commercial legal'], archetype: 'draft-and-approve', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['A third-party agreement enters legal intake.', 'Umowa strony trzeciej trafia do legal intake.'], subject: ['agreement, clause library, fallback positions, and matter context', 'umowę, bibliotekę klauzul, fallback positions i kontekst sprawy'], decision: ['playbook-aligned redlines and escalated deviations', 'redline zgodne z playbookiem i eskalowane odstępstwa'], output: ['Lawyer-approved redline package', 'Pakiet redline zaakceptowany przez prawnika'], system: 'Harvey', impact: [20, 45, ['Reduction in first-pass contract review time', 'Spadek czasu pierwszego przeglądu umowy'], 'vendor_report', 'medium'], sourceKeys: ['harvey', 'contractAgent'] },
    { slug: 'litigation-evidence-chronology', title: ['Litigation evidence chronology', 'Chronologia dowodów w sporze'], oneLiner: ['Build a source-linked chronology from productions without making legal conclusions.', 'Buduje chronologię powiązaną ze źródłami z materiałów sprawy bez wniosków prawnych.'], category: 'legal-compliance', department: ['Litigation', 'Litigation'], archetype: 'investigate-and-report', industries: ['legal services', 'cross-industry'], riskLevel: 'high', maturity: 'emerging', trigger: ['A reviewed production set or new evidence batch is available.', 'Dostępny jest sprawdzony production set lub nowa partia dowodów.'], subject: ['produced documents, metadata, issue tags, and privilege rules', 'dokumenty, metadata, tagi zagadnień i reguły privilege'], decision: ['a cited chronology and unresolved conflicts', 'cytowaną chronologię i nierozwiązane konflikty'], output: ['Counsel-reviewed evidence chronology', 'Chronologia dowodów po review counsel'], system: 'Relativity', impact: [20, 50, ['Reduction in chronology preparation time', 'Spadek czasu przygotowania chronologii'], 'vendor_report', 'low'], sourceKeys: ['harvey'] },
    { slug: 'grc-remediation-planning', title: ['GRC remediation planning', 'Planowanie remediacji GRC'], oneLiner: ['Translate a control finding into cited, system-specific remediation steps for owner approval.', 'Zamienia ustalenie kontroli w cytowane, specyficzne dla systemu kroki remediacji do akceptacji ownera.'], category: 'legal-compliance', department: ['Governance, risk, and compliance', 'Governance, risk and compliance'], archetype: 'draft-and-approve', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['A control test produces a new or reopened finding.', 'Test kontroli tworzy nowe lub ponownie otwarte ustalenie.'], subject: ['control finding, system configuration, policy, and evidence', 'ustalenie kontroli, konfigurację systemu, politykę i dowody'], decision: ['a prioritized remediation plan with validation steps', 'priorytetowy plan remediacji z krokami walidacji'], output: ['Owned remediation ticket with acceptance test', 'Przypisany ticket remediacji z testem akceptacyjnym'], system: 'Vanta', impact: [20, 45, ['Reduction in remediation research time', 'Spadek czasu researchu remediacji'], 'case_study', 'medium'], sourceKeys: ['vanta'] },
    { slug: 'audit-evidence-collection', title: ['Audit evidence collection', 'Zbieranie dowodów audytowych'], oneLiner: ['Request, validate, and package control evidence while preserving provenance.', 'Prosi, waliduje i pakuje dowody kontroli z zachowaniem pochodzenia.'], category: 'legal-compliance', department: ['Internal audit', 'Audyt wewnętrzny'], archetype: 'orchestrate-multi-step', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['An audit request list or recurring control window opens.', 'Otwiera się lista żądań audytu lub cykliczne okno kontroli.'], subject: ['PBC request, control owner, evidence rules, and system records', 'PBC request, ownera kontroli, reguły dowodów i rekordy systemowe'], decision: ['evidence completeness and exception status', 'kompletność dowodów i status wyjątku'], output: ['Source-linked audit evidence package', 'Pakiet dowodów audytowych powiązany ze źródłami'], system: 'AuditBoard', impact: [20, 40, ['Reduction in evidence collection administration time', 'Spadek czasu administracji zbieraniem dowodów'], 'research', 'medium'], sourceKeys: ['vanta', 'pwcFinance'] },
    { slug: 'regulatory-change-impact-assessment', title: ['Regulatory change impact assessment', 'Ocena wpływu zmiany regulacyjnej'], oneLiner: ['Map a reviewed regulatory update to policies, controls, systems, and accountable owners.', 'Mapuje sprawdzoną zmianę regulacyjną do polityk, kontroli, systemów i odpowiedzialnych ownerów.'], category: 'legal-compliance', department: ['Regulatory compliance', 'Compliance regulacyjne'], archetype: 'investigate-and-report', industries: ['financial services', 'insurance', 'healthcare'], riskLevel: 'high', maturity: 'emerging', trigger: ['Counsel approves a regulatory update for impact analysis.', 'Counsel zatwierdza zmianę regulacyjną do analizy wpływu.'], subject: ['regulatory text, legal interpretation, policies, controls, and inventory', 'tekst regulacji, interpretację prawną, polityki, kontrole i inventory'], decision: ['an evidence-linked impact map and proposed owners', 'mapę wpływu z dowodami i proponowanych ownerów'], output: ['Counsel-approved remediation scope', 'Zakres remediacji zaakceptowany przez counsel'], system: 'ServiceNow GRC', impact: [15, 35, ['Reduction in initial impact-mapping time', 'Spadek czasu wstępnego mapowania wpływu'], 'editorial_estimate', 'low'], sourceKeys: ['vanta', 'harvey'] },

    { slug: 'insurance-claims-intake', title: ['Insurance claims intake', 'Intake szkód ubezpieczeniowych'], oneLiner: ['Extract claim facts, check completeness, and route severity without deciding coverage.', 'Ekstrahuje fakty szkody, sprawdza kompletność i kieruje według powagi bez decyzji o pokryciu.'], category: 'insurance', department: ['Claims', 'Claims'], archetype: 'enrich-and-route', industries: ['insurance'], riskLevel: 'high', maturity: 'proven', trigger: ['A first notice of loss arrives through an approved channel.', 'First notice of loss wpływa zatwierdzonym kanałem.'], subject: ['FNOL, policy, attachments, claimant, and incident data', 'FNOL, polisę, załączniki, claimant i dane zdarzenia'], decision: ['a complete intake, severity route, and missing-evidence request', 'kompletny intake, routing severity i prośbę o brakujące dowody'], output: ['Adjuster-ready claim file', 'Sprawa szkody gotowa dla adjustera'], system: 'Guidewire', impact: [20, 45, ['Reduction in claim intake handling time', 'Spadek czasu obsługi intake szkody'], 'vendor_report', 'medium'], sourceKeys: ['newfront', 'gradient'] },
    { slug: 'insurance-claim-orchestration', title: ['Insurance claim orchestration', 'Orkiestracja procesu szkody'], oneLiner: ['Coordinate documents, vendors, reserves, and claimant updates around adjuster decisions.', 'Koordynuje dokumenty, vendorów, rezerwy i komunikację wokół decyzji adjustera.'], category: 'insurance', department: ['Claims operations', 'Claims operations'], archetype: 'orchestrate-multi-step', industries: ['insurance'], riskLevel: 'high', maturity: 'emerging', trigger: ['An adjuster approves the next claim-handling stage.', 'Adjuster zatwierdza kolejny etap obsługi szkody.'], subject: ['claim plan, approvals, vendor tasks, documents, and communications', 'plan szkody, akceptacje, zadania vendorów, dokumenty i komunikację'], decision: ['the next compliant tasks and exception route', 'kolejne zgodne zadania i ścieżkę wyjątków'], output: ['Updated claim plan with owned actions', 'Zaktualizowany plan szkody z przypisanymi akcjami'], system: 'Guidewire', impact: [15, 35, ['Reduction in claim coordination time', 'Spadek czasu koordynacji szkody'], 'vendor_report', 'low'], sourceKeys: ['newfront', 'gradient'] },
    { slug: 'underwriting-research-pack', title: ['Underwriting research pack', 'Pakiet researchu underwritingowego'], oneLiner: ['Assemble cited exposure, loss, and external risk evidence for an underwriter.', 'Składa cytowane dowody ekspozycji, szkód i ryzyka zewnętrznego dla underwritera.'], category: 'insurance', department: ['Underwriting', 'Underwriting'], archetype: 'investigate-and-report', industries: ['insurance'], riskLevel: 'high', maturity: 'proven', trigger: ['A complete submission reaches underwriting review.', 'Kompletne zgłoszenie trafia do przeglądu underwritingowego.'], subject: ['submission, loss runs, exposure schedule, policy, and approved research', 'submission, historię szkód, ekspozycje, polisę i zatwierdzony research'], decision: ['a cited risk brief with unanswered questions', 'cytowany brief ryzyka z pytaniami bez odpowiedzi'], output: ['Underwriter-reviewed research pack', 'Pakiet researchu po review underwritera'], system: 'Duck Creek', impact: [20, 45, ['Reduction in underwriting research time', 'Spadek czasu researchu underwritingowego'], 'vendor_report', 'medium'], sourceKeys: ['newfront'] },
    { slug: 'title-escrow-transaction-review', title: ['Title and escrow transaction review', 'Przegląd transakcji title i escrow'], oneLiner: ['Review transaction emails and documents, detect errors, and propose bounded closing actions.', 'Przegląda e-maile i dokumenty transakcji, wykrywa błędy i proponuje ograniczone akcje closingowe.'], category: 'insurance', department: ['Title and escrow operations', 'Operacje title i escrow'], archetype: 'orchestrate-multi-step', industries: ['real estate', 'title insurance'], riskLevel: 'high', maturity: 'scaled', trigger: ['New transaction documents or emails enter an active closing file.', 'Nowe dokumenty lub e-maile trafiają do aktywnej sprawy closingowej.'], subject: ['closing file, email, documents, accounting, and legal requirements', 'sprawę closingową, e-mail, dokumenty, księgowość i wymogi prawne'], decision: ['a cited answer, error flag, or permitted correction', 'cytowaną odpowiedź, flagę błędu lub dozwoloną korektę'], output: ['Reviewed transaction update or expert escalation', 'Sprawdzona aktualizacja transakcji lub eskalacja ekspercka'], system: 'Qualia', impact: [20, 50, ['Reduction in manual transaction review time', 'Spadek ręcznego czasu przeglądu transakcji'], 'vendor_report', 'low'], sourceKeys: ['qualia'] },

    { slug: 'soc-alert-triage', title: ['SOC alert triage', 'Triaging alertów SOC'], oneLiner: ['Enrich alerts, rank confidence, and prepare a cited disposition for analyst approval.', 'Wzbogaca alerty, ocenia pewność i przygotowuje cytowaną dyspozycję do akceptacji analityka.'], category: 'security-it', department: ['Security operations', 'Security operations'], archetype: 'enrich-and-route', industries: ['cross-industry'], riskLevel: 'high', maturity: 'scaled', trigger: ['A supported security alert enters the SOC queue.', 'Obsługiwany alert bezpieczeństwa trafia do kolejki SOC.'], subject: ['alert, asset, identity, threat intelligence, and prior cases', 'alert, asset, identity, threat intelligence i wcześniejsze sprawy'], decision: ['a cited severity, disposition, and response route', 'cytowane severity, dyspozycję i ścieżkę reakcji'], output: ['Analyst-approved alert disposition', 'Dyspozycja alertu zaakceptowana przez analityka'], system: 'Splunk', impact: [20, 40, ['Reduction in analyst time per alert batch', 'Spadek czasu analityka na partię alertów'], 'case_study', 'medium'], sourceKeys: ['trellix'] },
    { slug: 'malware-hunt-investigation', title: ['Malware hunt investigation', 'Dochodzenie malware hunt'], oneLiner: ['Correlate malware evidence across assets and produce an explainable hunt plan.', 'Koreluje dowody malware między assetami i tworzy wyjaśnialny plan hunt.'], category: 'security-it', department: ['Threat hunting', 'Threat hunting'], archetype: 'investigate-and-report', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['A novel sample, indicator, or threat hypothesis is approved for investigation.', 'Nowa próbka, indicator lub hipoteza zagrożenia zostaje zatwierdzona do badania.'], subject: ['sample, telemetry, indicators, asset context, and prior detections', 'próbkę, telemetrię, indicators, kontekst assetów i wcześniejsze detekcje'], decision: ['a cited hypothesis, affected scope, and hunt queries', 'cytowaną hipotezę, zakres wpływu i zapytania hunt'], output: ['Analyst-reviewed malware hunt report', 'Raport malware hunt po review analityka'], system: 'Stairwell', impact: [15, 35, ['Reduction in initial malware investigation time', 'Spadek czasu wstępnego dochodzenia malware'], 'vendor_report', 'low'], sourceKeys: ['stairwell'] },
    { slug: 'natural-language-security-workflow', title: ['Natural-language security workflow compilation', 'Kompilacja security workflow z języka naturalnego'], oneLiner: ['Compile an analyst-authored procedure into a testable automation with bounded tools.', 'Kompiluje procedurę analityka w testowalną automatyzację z ograniczonymi narzędziami.'], category: 'security-it', department: ['Security engineering', 'Security engineering'], archetype: 'orchestrate-multi-step', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['An analyst submits an approved procedure and representative test cases.', 'Analityk przekazuje zatwierdzoną procedurę i reprezentatywne test cases.'], subject: ['procedure, schemas, connector permissions, and test fixtures', 'procedurę, schematy, uprawnienia konektorów i fixtures testowe'], decision: ['a least-privilege executable workflow and test report', 'wykonywalny workflow least-privilege i raport testów'], output: ['Versioned, tested automation pending activation', 'Wersjonowana, przetestowana automatyzacja oczekująca na aktywację'], system: 'Tines', impact: [50, 90, ['Reduction in workflow build lead time', 'Spadek lead time budowy workflow'], 'case_study', 'medium'], sourceKeys: ['tines'] },
    { slug: 'p1-incident-response', title: ['P1 incident response coordination', 'Koordynacja reakcji na incydent P1'], oneLiner: ['Build a live incident timeline, coordinate responders, and gate every production action.', 'Buduje żywą oś incydentu, koordynuje responderów i bramkuje każdą akcję produkcyjną.'], category: 'security-it', department: ['Site reliability engineering', 'Site reliability engineering'], archetype: 'orchestrate-multi-step', industries: ['software', 'financial services'], riskLevel: 'high', maturity: 'emerging', trigger: ['An incident is declared severity P1 by monitoring or an on-call engineer.', 'Monitoring lub on-call ogłasza incydent severity P1.'], subject: ['alerts, logs, deploys, runbooks, ownership, and communications', 'alerty, logi, deploye, runbooki, ownership i komunikację'], decision: ['a cited hypothesis and reversible next action', 'cytowaną hipotezę i odwracalną kolejną akcję'], output: ['Approved response action, timeline, and status update', 'Zaakceptowana akcja reakcji, timeline i status update'], system: 'PagerDuty', impact: [10, 30, ['Reduction in incident coordination time', 'Spadek czasu koordynacji incydentu'], 'vendor_report', 'low'], sourceKeys: ['sentry', 'xKaxil'] },
    { slug: 'legacy-access-provisioning', title: ['Legacy access provisioning', 'Provisioning dostępu w systemach legacy'], oneLiner: ['Translate an approved access request into system-specific steps with segregation-of-duties checks.', 'Zamienia zatwierdzony wniosek dostępu w kroki dla systemu z kontrolą segregation of duties.'], category: 'security-it', department: ['Identity and access management', 'Identity and access management'], archetype: 'auto-execute-with-guardrails', industries: ['cross-industry'], riskLevel: 'high', maturity: 'emerging', trigger: ['A manager-approved access request passes identity verification.', 'Wniosek dostępu zaakceptowany przez managera przechodzi weryfikację tożsamości.'], subject: ['identity, role catalog, approvals, SoD rules, and target state', 'tożsamość, katalog ról, akceptacje, reguły SoD i target state'], decision: ['a permitted least-privilege provisioning plan', 'dozwolony plan provisioningu least-privilege'], output: ['Provisioned access with verification and expiry', 'Nadany dostęp z weryfikacją i datą wygaśnięcia'], system: 'ServiceNow', impact: [20, 45, ['Reduction in access-request cycle time', 'Spadek czasu cyklu wniosku dostępowego'], 'vendor_report', 'low'], sourceKeys: ['microsoftCopilot', 'xLieben'] },

    { slug: 'investment-due-diligence-research', title: ['Investment due diligence research', 'Research due diligence inwestycji'], oneLiner: ['Collect source-linked company, market, and risk evidence into an analyst-reviewed memo.', 'Zbiera powiązane ze źródłami dowody o firmie, rynku i ryzyku w memo do review analityka.'], category: 'operations', department: ['Investment research', 'Research inwestycyjny'], archetype: 'investigate-and-report', industries: ['asset management', 'private equity'], riskLevel: 'high', maturity: 'proven', trigger: ['An approved company or transaction enters due diligence.', 'Zatwierdzona firma lub transakcja trafia do due diligence.'], subject: ['company filings, approved research, data room, and diligence questions', 'filingi firmy, zatwierdzony research, data room i pytania diligence'], decision: ['a cited finding set with conflicts and unknowns', 'cytowany zestaw ustaleń z konfliktami i niewiadomymi'], output: ['Analyst-reviewed diligence memo', 'Memo diligence po review analityka'], system: 'Auquan', impact: [25, 55, ['Reduction in research collection and synthesis time', 'Spadek czasu zbierania i syntezy researchu'], 'case_study', 'medium'], sourceKeys: ['auquan'] },
    { slug: 'order-fulfillment-exception', title: ['Order fulfillment exception resolution', 'Rozwiązywanie wyjątków fulfillment'], oneLiner: ['Investigate blocked orders and coordinate an approved inventory, carrier, or customer action.', 'Bada zablokowane zamówienia i koordynuje zatwierdzoną akcję inventory, przewoźnika lub klienta.'], category: 'operations', department: ['Order operations', 'Order operations'], archetype: 'orchestrate-multi-step', industries: ['retail', 'manufacturing', 'logistics'], riskLevel: 'medium', maturity: 'proven', trigger: ['An order misses a fulfillment milestone or violates a service threshold.', 'Zamówienie nie spełnia milestone fulfillment lub progu usługi.'], subject: ['order, inventory, warehouse, carrier, promise, and customer data', 'zamówienie, inventory, warehouse, przewoźnika, promise i dane klienta'], decision: ['a lowest-impact compliant recovery action', 'zgodną akcję odzyskania o najniższym wpływie'], output: ['Approved recovery task and updated promise', 'Zaakceptowane zadanie recovery i zaktualizowany promise'], system: 'SAP', impact: [15, 35, ['Reduction in fulfillment exception handling time', 'Spadek czasu obsługi wyjątków fulfillment'], 'editorial_estimate', 'medium'], sourceKeys: ['xKaxil'] },
    { slug: 'vendor-onboarding-orchestration', title: ['Vendor onboarding orchestration', 'Orkiestracja onboardingu vendora'], oneLiner: ['Coordinate tax, security, legal, banking, and procurement checks before activation.', 'Koordynuje kontrole tax, security, legal, bankowe i procurement przed aktywacją.'], category: 'operations', department: ['Vendor management', 'Vendor management'], archetype: 'orchestrate-multi-step', industries: ['cross-industry'], riskLevel: 'high', maturity: 'proven', trigger: ['Procurement approves a vendor for onboarding.', 'Procurement zatwierdza vendora do onboardingu.'], subject: ['vendor identity, tax, bank, security, contract, and ownership data', 'tożsamość vendora, tax, bank, security, umowę i ownership'], decision: ['a complete activation checklist and exception route', 'kompletną checklistę aktywacji i ścieżkę wyjątków'], output: ['Approved vendor master record', 'Zaakceptowany rekord vendor master'], system: 'Coupa', impact: [20, 40, ['Reduction in vendor onboarding cycle time', 'Spadek czasu cyklu onboardingu vendora'], 'research', 'medium'], sourceKeys: ['pwcFinance', 'contractAgent'] },
    { slug: 'field-service-dispatch-recovery', title: ['Field service dispatch recovery', 'Recovery dispatchu field service'], oneLiner: ['Re-plan disrupted field visits within skills, SLA, travel, and customer constraints.', 'Przeplanowuje zakłócone wizyty terenowe w granicach skills, SLA, podróży i ograniczeń klienta.'], category: 'operations', department: ['Field service', 'Field service'], archetype: 'auto-execute-with-guardrails', industries: ['utilities', 'telecommunications', 'home services'], riskLevel: 'high', maturity: 'emerging', trigger: ['A technician cancels, a job overruns, or an urgent case enters the queue.', 'Technik anuluje, zadanie się przedłuża lub do kolejki trafia pilna sprawa.'], subject: ['jobs, skills, location, SLA, parts, shifts, and customer windows', 'zadania, skills, lokalizację, SLA, części, zmiany i okna klienta'], decision: ['a constraint-valid recovery schedule', 'harmonogram recovery zgodny z ograniczeniami'], output: ['Dispatcher-approved schedule and customer notifications', 'Harmonogram zaakceptowany przez dispatchera i powiadomienia klientów'], system: 'Salesforce Field Service', impact: [10, 30, ['Reduction in dispatch recovery time', 'Spadek czasu recovery dispatchu'], 'editorial_estimate', 'low'], sourceKeys: ['salesforceService', 'xLieben'] },
  ]),
]

const additionalBlueprints: Blueprint[] = [
  {
    slug: 'inbound-lead-research-and-outreach',
    title: ['Inbound lead research and outreach', 'Research i outreach dla inbound leadów'],
    oneLiner: ['Research each inbound lead and prepare a cited, personalized first touch for approval.', 'Bada każdy inbound lead i przygotowuje do akceptacji cytowany, personalizowany pierwszy kontakt.'],
    category: 'sales',
    department: ['Sales development', 'Sales development'],
    archetype: 'draft-and-approve',
    industries: ['B2B software', 'business services'],
    companySizes: ['small', 'medium', 'enterprise'],
    difficulty: 'medium',
    maturity: 'proven',
    riskLevel: 'medium',
    weeks: [3, 6],
    trigger: ['A new inbound lead is created with a business email.', 'Powstaje nowy inbound lead z firmowym adresem e-mail.'],
    inputs: [['Lead and campaign fields', 'Pola leada i kampanii'], ['Approved public research sources', 'Zatwierdzone publiczne źródła researchu']],
    steps: [['Verify person and company identity.', 'Weryfikuje osobę i firmę.'], ['Research role, priorities, and relevant signals.', 'Bada rolę, priorytety i istotne sygnały.'], ['Draft a source-backed message and next step.', 'Tworzy wiadomość ze źródłami i kolejnym krokiem.'], ['Send only the approved draft and log it.', 'Wysyła wyłącznie zaakceptowany draft i loguje go.']],
    checkpoint: ['SDR approves facts, tone, and send timing.', 'SDR zatwierdza fakty, ton i czas wysyłki.'],
    outputs: [['Research brief', 'Brief researchowy'], ['Approved outreach logged in CRM', 'Zaakceptowany outreach zapisany w CRM']],
    minimumStack: commonStack.crm,
    tools: [['Clay', ['Orchestrates enrichment and research.', 'Orkiestruje enrichment i research.']], ['Salesforce', ['Provides lead context and activity history.', 'Dostarcza kontekst leada i historię aktywności.']]],
    risk: ['Hallucinated facts can damage trust.', 'Zmyślone fakty mogą zniszczyć zaufanie.'],
    mitigation: ['Attach a URL to every external claim and block uncited personalization.', 'Dołącz URL do każdej zewnętrznej tezy i blokuj personalizację bez źródła.'],
    guardrails: [['Use only approved public sources.', 'Używaj tylko zatwierdzonych źródeł publicznych.'], ['Cap send volume per owner and domain.', 'Ogranicz wolumen wysyłki per owner i domena.']],
    impact: [20, 45, ['Reduction in SDR research time per inbound lead', 'Spadek czasu researchu SDR na inbound lead'], 'vendor_report', 'medium', ['Derived from removing repeated enrichment and drafting work; it is not a conversion promise.', 'Wynika z usunięcia powtarzalnego enrichmentu i draftingu; nie jest obietnicą konwersji.']],
    sourceKeys: ['clay', 'xRiley'],
  },
  {
    slug: 'account-brief-before-sales-call',
    title: ['Account brief before a sales call', 'Brief konta przed rozmową sprzedażową'],
    oneLiner: ['Assemble a cited account brief from CRM, product usage, and approved external signals.', 'Składa cytowany brief konta z CRM, użycia produktu i zatwierdzonych sygnałów zewnętrznych.'],
    category: 'sales',
    department: ['Account executives', 'Account executives'],
    archetype: 'investigate-and-report',
    industries: ['B2B software', 'financial services', 'professional services'],
    companySizes: ['medium', 'enterprise'],
    difficulty: 'medium',
    maturity: 'proven',
    riskLevel: 'low',
    weeks: [3, 6],
    trigger: ['A customer or prospect meeting is scheduled within 24 hours.', 'Spotkanie z klientem lub prospectem jest zaplanowane w ciągu 24 godzin.'],
    inputs: [['CRM history and opportunity fields', 'Historia CRM i pola opportunity'], ['Product usage and approved news feeds', 'Użycie produktu i zatwierdzone źródła newsów']],
    steps: [['Collect current internal account context.', 'Zbiera aktualny wewnętrzny kontekst konta.'], ['Find changes, open questions, and relationship gaps.', 'Wyszukuje zmiany, otwarte pytania i luki relacji.'], ['Build a cited brief with recommended questions.', 'Buduje cytowany brief z rekomendowanymi pytaniami.'], ['Deliver the approved brief to the meeting owner.', 'Dostarcza zaakceptowany brief ownerowi spotkania.']],
    checkpoint: ['Account owner validates sensitive claims and priorities.', 'Owner konta weryfikuje wrażliwe tezy i priorytety.'],
    outputs: [['One-page account brief', 'Jednostronicowy brief konta'], ['Question and risk list', 'Lista pytań i ryzyk']],
    minimumStack: commonStack.crm,
    tools: [['Salesforce', ['Supplies opportunity and relationship history.', 'Dostarcza historię opportunity i relacji.']], ['Slack', ['Delivers the review-ready brief.', 'Dostarcza brief gotowy do przeglądu.']]],
    risk: ['Stale CRM data may be presented as current.', 'Nieaktualne dane CRM mogą zostać przedstawione jako bieżące.'],
    mitigation: ['Display source timestamps and label every inference.', 'Pokazuj czas źródła i oznaczaj każdą inferencję.'],
    guardrails: [['Never infer personal traits.', 'Nigdy nie wnioskuj cech osobistych.'], ['Exclude restricted account notes from external summaries.', 'Wyklucz zastrzeżone notatki konta z zewnętrznych podsumowań.']],
    impact: [25, 50, ['Reduction in manual meeting-preparation time', 'Spadek ręcznego czasu przygotowania do spotkania'], 'editorial_estimate', 'medium', ['A directional range based on consolidating retrieval and synthesis; depth of CRM history changes the gain.', 'Zakres kierunkowy oparty na konsolidacji wyszukiwania i syntezy; głębokość historii CRM zmienia wynik.']],
    sourceKeys: ['salesforceSales', 'clay'],
  },
  {
    slug: 'sales-transcript-to-crm-hygiene',
    title: ['Sales transcript to CRM hygiene', 'Transkrypt sprzedażowy do porządku w CRM'],
    oneLiner: ['Extract commitments and field updates from calls, then apply only approved CRM changes.', 'Wyciąga ustalenia i aktualizacje pól z rozmów, a następnie stosuje tylko zatwierdzone zmiany CRM.'],
    category: 'sales',
    department: ['Sales operations', 'Sales operations'],
    archetype: 'draft-and-approve',
    industries: ['B2B software', 'business services'],
    companySizes: ['small', 'medium', 'enterprise'],
    difficulty: 'low',
    maturity: 'scaled',
    riskLevel: 'medium',
    weeks: [2, 5],
    trigger: ['A recorded sales call finishes and its transcript is available.', 'Kończy się nagrana rozmowa sprzedażowa i dostępny jest transkrypt.'],
    inputs: [['Speaker-attributed transcript', 'Transkrypt z rozpoznanymi mówcami'], ['CRM field schema and current opportunity', 'Schemat pól CRM i bieżąca opportunity']],
    steps: [['Extract decisions, dates, objections, and owners.', 'Wyciąga decyzje, daty, obiekcje i ownerów.'], ['Map facts to allowed CRM fields.', 'Mapuje fakty do dozwolonych pól CRM.'], ['Propose a diff with transcript citations.', 'Proponuje diff z cytatami z transkryptu.'], ['Apply approved fields and create tasks.', 'Stosuje zaakceptowane pola i tworzy zadania.']],
    checkpoint: ['Call owner approves the field diff and follow-ups.', 'Owner rozmowy zatwierdza diff pól i follow-upy.'],
    outputs: [['CRM update diff', 'Diff aktualizacji CRM'], ['Owned follow-up tasks', 'Follow-upy z przypisanym ownerem']],
    minimumStack: commonStack.crm,
    tools: [['Zoom', ['Provides the call transcript.', 'Dostarcza transkrypt rozmowy.']], ['HubSpot', ['Stores approved fields and tasks.', 'Przechowuje zatwierdzone pola i zadania.']]],
    risk: ['Speaker attribution errors can assign commitments to the wrong person.', 'Błędy rozpoznania mówcy mogą przypisać ustalenia niewłaściwej osobie.'],
    mitigation: ['Cite transcript spans and require owner approval before writes.', 'Cytuj fragmenty transkryptu i wymagaj akceptacji ownera przed zapisem.'],
    guardrails: [['Allowlist writable CRM fields.', 'Stosuj allowlistę zapisywalnych pól CRM.'], ['Never overwrite a newer human edit.', 'Nigdy nie nadpisuj nowszej edycji człowieka.']],
    impact: [30, 60, ['Reduction in post-call administration time', 'Spadek czasu administracji po rozmowie'], 'editorial_estimate', 'medium', ['A planning range for extraction and field preparation, excluding call review needed for ambiguous deals.', 'Zakres planistyczny dla ekstrakcji i przygotowania pól, bez przeglądu niejednoznacznych rozmów.']],
    sourceKeys: ['salesforceSales', 'xKaxil'],
  },
  {
    slug: 'cpq-quote-preparation',
    title: ['CPQ quote preparation', 'Przygotowanie oferty CPQ'],
    oneLiner: ['Turn an approved deal configuration into a policy-checked quote draft with exception routing.', 'Zamienia zatwierdzoną konfigurację deala w sprawdzony politykami draft oferty z routingiem wyjątków.'],
    category: 'sales',
    department: ['Deal desk', 'Deal desk'],
    archetype: 'orchestrate-multi-step',
    industries: ['B2B software', 'manufacturing', 'telecommunications'],
    companySizes: ['medium', 'enterprise'],
    difficulty: 'high',
    maturity: 'emerging',
    riskLevel: 'high',
    weeks: [8, 16],
    trigger: ['An opportunity reaches the quote stage with required configuration fields.', 'Opportunity osiąga etap oferty z wymaganymi polami konfiguracji.'],
    inputs: [['Approved product and pricing catalog', 'Zatwierdzony katalog produktów i cen'], ['Opportunity, terms, and entitlement data', 'Dane opportunity, warunków i uprawnień']],
    steps: [['Validate configuration completeness.', 'Waliduje kompletność konfiguracji.'], ['Apply pricing, discount, and compatibility rules.', 'Stosuje reguły cen, rabatów i kompatybilności.'], ['Draft quote and isolate policy exceptions.', 'Tworzy draft oferty i izoluje wyjątki od polityk.'], ['Generate the approved quote and update stage.', 'Generuje zaakceptowaną ofertę i aktualizuje etap.']],
    checkpoint: ['Deal desk approves discounts, exceptions, and legal terms.', 'Deal desk zatwierdza rabaty, wyjątki i warunki prawne.'],
    outputs: [['Versioned quote draft', 'Wersjonowany draft oferty'], ['Exception register', 'Rejestr wyjątków']],
    minimumStack: commonStack.operations,
    tools: [['Salesforce CPQ', ['Provides catalog rules and creates the quote.', 'Dostarcza reguły katalogu i tworzy ofertę.']], ['DocuSign', ['Routes the approved document for signature.', 'Kieruje zaakceptowany dokument do podpisu.']]],
    risk: ['Incorrect pricing or entitlement can create material leakage.', 'Błędna cena lub uprawnienie może wywołać istotny leakage.'],
    mitigation: ['Keep deterministic pricing outside the model and require approval for every exception.', 'Trzymaj deterministyczne ceny poza modelem i wymagaj akceptacji każdego wyjątku.'],
    guardrails: [['The model cannot calculate final price.', 'Model nie może obliczać ceny końcowej.'], ['Block quote creation when required evidence is missing.', 'Blokuj ofertę przy braku wymaganych dowodów.']],
    impact: [15, 35, ['Reduction in quote cycle time', 'Spadek czasu cyklu oferty'], 'editorial_estimate', 'low', ['Directional estimate; catalog quality and exception rate determine most of the outcome.', 'Szacunek kierunkowy; jakość katalogu i odsetek wyjątków determinują większość wyniku.']],
    sourceKeys: ['salesforceSales', 'xLieben'],
  },
  {
    slug: 'renewal-risk-and-next-best-action',
    title: ['Renewal risk and next-best action', 'Ryzyko odnowienia i next-best action'],
    oneLiner: ['Monitor account signals, explain renewal risk, and queue a bounded retention action for approval.', 'Monitoruje sygnały konta, wyjaśnia ryzyko odnowienia i kolejkuje ograniczoną akcję retencyjną do akceptacji.'],
    category: 'sales',
    department: ['Customer success', 'Customer success'],
    archetype: 'monitor-and-alert',
    industries: ['B2B software', 'subscription services'],
    companySizes: ['medium', 'enterprise'],
    difficulty: 'high',
    maturity: 'emerging',
    riskLevel: 'medium',
    weeks: [6, 12],
    trigger: ['A renewal enters the configured horizon or a risk threshold changes.', 'Odnowienie wchodzi w zdefiniowany horyzont lub zmienia się próg ryzyka.'],
    inputs: [['Usage, support, billing, and relationship signals', 'Sygnały użycia, wsparcia, płatności i relacji'], ['Renewal terms and approved playbooks', 'Warunki odnowienia i zatwierdzone playbooki']],
    steps: [['Refresh account health evidence.', 'Odświeża dowody kondycji konta.'], ['Separate observed signals from inferred risk.', 'Oddziela obserwowane sygnały od inferowanego ryzyka.'], ['Recommend a bounded action and owner.', 'Rekomenduje ograniczoną akcję i ownera.'], ['Create the approved task and monitor response.', 'Tworzy zaakceptowane zadanie i monitoruje odpowiedź.']],
    checkpoint: ['CSM approves risk interpretation and customer action.', 'CSM zatwierdza interpretację ryzyka i akcję wobec klienta.'],
    outputs: [['Cited renewal-risk brief', 'Cytowany brief ryzyka odnowienia'], ['Approved retention task', 'Zaakceptowane zadanie retencyjne']],
    minimumStack: commonStack.operations,
    tools: [['Gainsight', ['Supplies health and renewal signals.', 'Dostarcza sygnały health i renewal.']], ['Salesforce', ['Stores account actions and ownership.', 'Przechowuje akcje konta i ownership.']]],
    risk: ['A biased score may trigger unnecessary pressure on healthy customers.', 'Stronniczy scoring może wywołać niepotrzebną presję na zdrowych klientów.'],
    mitigation: ['Expose factors, evaluate by segment, and make customer contact human-approved.', 'Pokazuj czynniki, oceniaj per segment i wymagaj ludzkiej akceptacji kontaktu.'],
    guardrails: [['No autonomous discounts or contract changes.', 'Brak autonomicznych rabatów i zmian umowy.'], ['Suppress alerts without fresh source data.', 'Wyciszaj alerty bez świeżych danych źródłowych.']],
    impact: [5, 15, ['Reduction in late renewal escalations', 'Spadek liczby późnych eskalacji odnowień'], 'editorial_estimate', 'low', ['Directional operational KPI, not a predicted churn reduction.', 'Kierunkowy KPI operacyjny, nie prognoza redukcji churnu.']],
    sourceKeys: ['salesforceSales'],
  },
]

const expansionBlueprints = expand([
  {
    slug: 'personal-inbox-action-triage',
    title: ['Personal inbox action triage', 'Skrzynka, która sama pilnuje ważnych spraw'],
    oneLiner: ['Find messages that require action, draft the next step, and leave sending to you.', 'Wyłapuje wiadomości wymagające działania, przygotowuje następny krok i zostawia wysyłkę Tobie.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Individual', 'Osoba prywatna'],
    benefit: ['Important messages stop getting buried.', 'Ważne wiadomości nie giną w skrzynce.'],
    complexity: 1,
    capabilities: ['tool-use', 'memory', 'human-approval'],
    archetype: 'enrich-and-route',
    industries: ['personal productivity'],
    trigger: ['A new email arrives or the daily inbox review starts.', 'Wpływa nowy e-mail albo zaczyna się codzienny przegląd skrzynki.'],
    subject: ['email threads, contacts, deadlines, and prior replies', 'wątki e-mail, kontakty, terminy i wcześniejsze odpowiedzi'],
    decision: ['a prioritized action, reminder, or draft reply', 'priorytetowe działanie, przypomnienie lub szkic odpowiedzi'],
    output: ['Reviewed personal action list', 'Sprawdzona lista spraw do załatwienia'],
    system: 'Email and calendar',
    sourceKeys: ['openclawOfficial', 'openclawCommunity'],
  },
  {
    slug: 'household-bill-due-monitor',
    title: ['Household bill due monitor', 'Rachunki opłacone na czas'],
    oneLiner: ['Read incoming bills, track due dates, and remind you before a payment becomes late.', 'Odczytuje rachunki, pilnuje terminów i przypomina, zanim płatność się spóźni.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Household budget owner', 'Osoba prowadząca domowy budżet'],
    benefit: ['Fewer late fees and missed payments.', 'Mniej opłat za spóźnienie i przeoczonych płatności.'],
    complexity: 1,
    capabilities: ['document-understanding', 'vision', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['personal finance'],
    trigger: ['A bill arrives or a due date enters the reminder window.', 'Przychodzi rachunek albo termin płatności zbliża się do ustawionego progu.'],
    subject: ['bill image or PDF, amount, due date, and payment history', 'obraz lub PDF rachunku, kwotę, termin i historię płatności'],
    decision: ['a verified payment reminder with the source document', 'sprawdzone przypomnienie o płatności z dokumentem źródłowym'],
    output: ['Due-date calendar and approved reminders', 'Kalendarz terminów i zatwierdzone przypomnienia'],
    system: 'Email, files, and calendar',
    sourceKeys: ['openclawCommunity', 'hermesDocs'],
  },
  {
    slug: 'subscription-renewal-watch',
    title: ['Subscription renewal watch', 'Koniec z niechcianymi odnowieniami'],
    oneLiner: ['Spot renewals and price changes early, then prepare cancellation or downgrade options.', 'Wcześnie wykrywa odnowienia i podwyżki, a potem przygotowuje opcje anulowania lub tańszego planu.'],
    category: 'personal',
    contexts: ['personal', 'freelance'],
    primaryUser: ['Subscriber', 'Osoba opłacająca subskrypcje'],
    benefit: ['You decide before the next charge.', 'Decydujesz przed kolejnym obciążeniem.'],
    complexity: 1,
    capabilities: ['document-understanding', 'memory', 'scheduled-monitoring', 'browser-actions', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['personal finance', 'software'],
    trigger: ['A renewal notice arrives or a charge date enters the configured window.', 'Przychodzi informacja o odnowieniu albo zbliża się data obciążenia.'],
    subject: ['renewal email, plan terms, price history, and account settings', 'e-mail o odnowieniu, warunki planu, historię ceny i ustawienia konta'],
    decision: ['keep, downgrade, or cancellation options with deadlines', 'opcje pozostania, zmiany planu lub anulowania wraz z terminami'],
    output: ['Approved renewal decision and reminder', 'Zatwierdzona decyzja o odnowieniu i przypomnienie'],
    system: 'Email and browser',
    sourceKeys: ['openclawCommunity', 'openaiOperator'],
  },
  {
    slug: 'personal-document-expiry-watch',
    title: ['Personal document expiry watch', 'Dokumenty odnowione bez nerwowego sprawdzania dat'],
    oneLiner: ['Track expiry dates and prepare the right renewal checklist before time runs out.', 'Pilnuje dat ważności i przygotowuje właściwą checklistę odnowienia z wyprzedzeniem.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Individual or family organizer', 'Osoba pilnująca dokumentów swoich lub rodziny'],
    benefit: ['Passports, IDs, permits, and insurance do not expire unnoticed.', 'Paszporty, dowody, pozwolenia i polisy nie tracą ważności bez ostrzeżenia.'],
    complexity: 1,
    capabilities: ['vision', 'document-understanding', 'memory', 'scheduled-monitoring'],
    archetype: 'monitor-and-alert',
    industries: ['personal administration'],
    trigger: ['A document is added or its expiry date enters the preparation window.', 'Dokument zostaje dodany albo jego data ważności wchodzi w okres przygotowania.'],
    subject: ['document image, holder, expiry date, jurisdiction, and renewal rules', 'obraz dokumentu, właściciela, datę ważności, jurysdykcję i zasady odnowienia'],
    decision: ['a dated renewal checklist and missing-document list', 'checklistę odnowienia z terminami i listę brakujących dokumentów'],
    output: ['Renewal plan with reminders', 'Plan odnowienia z przypomnieniami'],
    system: 'Files and calendar',
    sourceKeys: ['openclawOfficial', 'hermesDocs'],
  },
  {
    slug: 'shopping-shortlist-research',
    title: ['Shopping shortlist research', 'Krótka lista produktów naprawdę dopasowanych do Ciebie'],
    oneLiner: ['Compare specifications, reviews, stock, and price against your real constraints.', 'Porównuje parametry, opinie, dostępność i cenę z Twoimi rzeczywistymi wymaganiami.'],
    category: 'research',
    contexts: ['personal', 'freelance', 'small-business'],
    primaryUser: ['Buyer', 'Osoba planująca zakup'],
    benefit: ['Less tab-hopping and fewer bad-fit purchases.', 'Mniej skakania po kartach i mniej nietrafionych zakupów.'],
    complexity: 1,
    capabilities: ['web-research', 'browser-actions', 'memory', 'human-approval'],
    archetype: 'investigate-and-report',
    industries: ['retail', 'ecommerce'],
    trigger: ['The user provides a purchase goal, budget, and non-negotiable constraints.', 'Użytkownik podaje cel zakupu, budżet i warunki nie do negocjacji.'],
    subject: ['product requirements, retailer pages, reviews, price, and availability', 'wymagania produktu, strony sklepów, opinie, cenę i dostępność'],
    decision: ['a cited shortlist with trade-offs and rejected options', 'krótką listę ze źródłami, kompromisami i odrzuconymi opcjami'],
    output: ['User-reviewed buying shortlist', 'Krótka lista zakupowa po przeglądzie użytkownika'],
    system: 'Web browser',
    sourceKeys: ['openaiShopping', 'openaiOperator'],
  },
  {
    slug: 'family-calendar-conflict-resolver',
    title: ['Family calendar conflict resolver', 'Rodzinny kalendarz bez podwójnych rezerwacji'],
    oneLiner: ['Find clashes, travel gaps, and missing handoffs before the week starts.', 'Wykrywa kolizje, zbyt krótkie przejazdy i brakujące ustalenia, zanim zacznie się tydzień.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Family organizer', 'Osoba organizująca rodzinny kalendarz'],
    benefit: ['Everyone knows where to be and who is responsible.', 'Każdy wie, gdzie ma być i kto za co odpowiada.'],
    complexity: 1,
    capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'multi-step-planning', 'human-approval'],
    archetype: 'reconcile-and-flag',
    industries: ['personal productivity'],
    trigger: ['A new event is added or the weekly planning check starts.', 'Dodano nowe wydarzenie albo zaczyna się cotygodniowy przegląd.'],
    subject: ['shared calendars, locations, travel time, participants, and responsibilities', 'wspólne kalendarze, lokalizacje, czas przejazdu, uczestników i obowiązki'],
    decision: ['conflicts and the smallest workable schedule changes', 'kolizje i najmniejsze możliwe zmiany harmonogramu'],
    output: ['Approved conflict-free family plan', 'Zatwierdzony rodzinny plan bez kolizji'],
    system: 'Shared calendar',
    sourceKeys: ['openclawOfficial', 'hermesDocs'],
  },
  {
    slug: 'home-maintenance-planner',
    title: ['Home maintenance planner', 'Domowe naprawy zanim zmienią się w awarię'],
    oneLiner: ['Turn manuals, receipts, photos, and seasonal checks into a practical maintenance plan.', 'Zamienia instrukcje, rachunki, zdjęcia i sezonowe kontrole w praktyczny plan utrzymania domu.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Homeowner or tenant', 'Właściciel mieszkania lub najemca'],
    benefit: ['Small maintenance tasks happen before expensive failures.', 'Drobne prace są zrobione, zanim powstanie kosztowna awaria.'],
    complexity: 2,
    capabilities: ['vision', 'document-understanding', 'memory', 'scheduled-monitoring'],
    archetype: 'monitor-and-alert',
    industries: ['home services'],
    trigger: ['A home asset is added, a photo shows wear, or a seasonal check becomes due.', 'Dodano urządzenie, zdjęcie pokazuje zużycie albo zbliża się sezonowy przegląd.'],
    subject: ['asset photos, manuals, service history, age, and season', 'zdjęcia urządzeń, instrukcje, historię serwisu, wiek i porę roku'],
    decision: ['a prioritized maintenance task with evidence and due date', 'priorytetowe zadanie konserwacyjne z uzasadnieniem i terminem'],
    output: ['Approved home maintenance calendar', 'Zatwierdzony kalendarz utrzymania domu'],
    system: 'Files, photos, and calendar',
    sourceKeys: ['openclawCommunity', 'hermesDocs'],
  },
  {
    slug: 'warranty-return-claim-prep',
    title: ['Warranty and return claim preparation', 'Zwrot lub reklamacja z kompletem dowodów'],
    oneLiner: ['Match the receipt, policy, photos, and deadline, then prepare the claim for your approval.', 'Łączy paragon, regulamin, zdjęcia i termin, a potem przygotowuje reklamację do Twojej akceptacji.'],
    category: 'personal',
    contexts: ['personal', 'small-business'],
    primaryUser: ['Buyer or small-business owner', 'Kupujący lub właściciel małej firmy'],
    benefit: ['Less time searching for proof and return rules.', 'Mniej czasu na szukanie dowodów i zasad zwrotu.'],
    complexity: 2,
    capabilities: ['vision', 'document-understanding', 'browser-actions', 'human-approval'],
    archetype: 'draft-and-approve',
    industries: ['retail', 'ecommerce'],
    trigger: ['The user reports a defective or unsuitable purchase.', 'Użytkownik zgłasza wadliwy lub nietrafiony zakup.'],
    subject: ['receipt, product photos, warranty terms, return policy, and deadline', 'paragon, zdjęcia produktu, gwarancję, zasady zwrotu i termin'],
    decision: ['the eligible remedy and a source-backed claim draft', 'przysługujące rozwiązanie i szkic reklamacji oparty na źródłach'],
    output: ['Approved return or warranty claim package', 'Zatwierdzony pakiet zwrotu lub reklamacji'],
    system: 'Email and retailer portal',
    sourceKeys: ['openaiOperator', 'openclawCommunity'],
  },
  {
    slug: 'personal-spending-anomaly-digest',
    title: ['Personal spending anomaly digest', 'Nietypowe wydatki zauważone od razu'],
    oneLiner: ['Compare recent transactions with your normal pattern and explain only meaningful changes.', 'Porównuje nowe transakcje z typowym wzorcem i wyjaśnia tylko istotne zmiany.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Household budget owner', 'Osoba prowadząca domowy budżet'],
    benefit: ['Unexpected charges and spending drift become visible sooner.', 'Nieoczekiwane obciążenia i wzrost wydatków są widoczne wcześniej.'],
    complexity: 3,
    capabilities: ['document-understanding', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['personal finance'],
    trigger: ['A monthly statement arrives or a transaction crosses an anomaly threshold.', 'Przychodzi miesięczny wyciąg albo transakcja przekracza próg anomalii.'],
    subject: ['transactions, categories, recurring charges, and prior spending baseline', 'transakcje, kategorie, opłaty cykliczne i wcześniejszy poziom wydatków'],
    decision: ['a short anomaly list with source transactions and questions', 'krótką listę anomalii z transakcjami źródłowymi i pytaniami'],
    output: ['Reviewed personal spending digest', 'Sprawdzony przegląd domowych wydatków'],
    system: 'Bank export and spreadsheet',
    sourceKeys: ['openclawCommunity', 'openclawOperations'],
  },
  {
    slug: 'job-application-progress-tracker',
    title: ['Job application progress tracker', 'Aplikacje o pracę bez zgubionych terminów'],
    oneLiner: ['Track every application, detect stalled stages, and prepare the right follow-up.', 'Śledzi każdą aplikację, wykrywa zatrzymane etapy i przygotowuje właściwe przypomnienie.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Job seeker', 'Osoba szukająca pracy'],
    benefit: ['No interview, assignment, or follow-up falls through the cracks.', 'Żadna rozmowa, zadanie ani ważne przypomnienie nie przepada.'],
    complexity: 2,
    capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['career'],
    trigger: ['An application email arrives or a stage passes its follow-up date.', 'Przychodzi e-mail o aplikacji albo etap przekracza datę follow-upu.'],
    subject: ['application emails, role, company, stage, contacts, and dates', 'e-maile aplikacyjne, stanowisko, firmę, etap, kontakty i daty'],
    decision: ['the next dated action and an optional draft message', 'kolejne działanie z terminem i opcjonalny szkic wiadomości'],
    output: ['Current application board and approved follow-ups', 'Aktualna tablica aplikacji i zatwierdzone follow-upy'],
    system: 'Email, spreadsheet, and calendar',
    sourceKeys: ['openclawOfficial', 'hermesDocs'],
  },
  {
    slug: 'health-visit-preparation-pack',
    title: ['Health visit preparation pack', 'Lepsze przygotowanie do wizyty lekarskiej'],
    oneLiner: ['Organize symptoms, dates, medicines, and questions into a factual note for the visit.', 'Porządkuje objawy, daty, leki i pytania w rzeczową notatkę na wizytę.'],
    category: 'personal',
    contexts: ['personal'],
    primaryUser: ['Patient or caregiver', 'Pacjent lub opiekun'],
    benefit: ['The clinician gets a clearer history without the agent diagnosing anything.', 'Lekarz dostaje czytelniejszą historię, a agent nie stawia diagnozy.'],
    complexity: 2,
    capabilities: ['document-understanding', 'memory', 'human-approval'],
    archetype: 'draft-and-approve',
    industries: ['healthcare'],
    trigger: ['A medical appointment is scheduled and the user starts preparation.', 'Wizyta jest umówiona i użytkownik rozpoczyna przygotowanie.'],
    subject: ['user-provided symptoms, dates, medicines, records, and questions', 'podane przez użytkownika objawy, daty, leki, dokumenty i pytania'],
    decision: ['a factual chronology and unanswered question list', 'rzeczową chronologię i listę pytań bez odpowiedzi'],
    output: ['User-approved visit note', 'Notatka na wizytę zatwierdzona przez użytkownika'],
    system: 'Personal notes and files',
    sourceKeys: ['openclawOfficial', 'openaiAgentsTools'],
  },
  {
    slug: 'photo-document-archive',
    title: ['Photo and document archive', 'Zdjęcia i dokumenty, które da się później znaleźć'],
    oneLiner: ['Read dates, places, people, and document types, then propose a searchable filing structure.', 'Odczytuje daty, miejsca, osoby i typy dokumentów, a potem proponuje przeszukiwalny porządek.'],
    category: 'personal',
    contexts: ['personal', 'freelance'],
    primaryUser: ['Individual or creator', 'Osoba prywatna lub twórca'],
    benefit: ['Files become findable without hours of manual renaming.', 'Pliki da się znaleźć bez wielogodzinnego ręcznego nazywania.'],
    complexity: 2,
    capabilities: ['vision', 'document-understanding', 'memory', 'human-approval'],
    archetype: 'enrich-and-route',
    industries: ['personal productivity', 'media'],
    trigger: ['A new batch of photos or scanned documents enters the inbox folder.', 'Nowa partia zdjęć lub skanów trafia do folderu wejściowego.'],
    subject: ['images, document text, timestamps, existing folders, and naming rules', 'obrazy, tekst dokumentów, daty, istniejące foldery i zasady nazw'],
    decision: ['search tags, names, and destination folders', 'tagi wyszukiwania, nazwy i foldery docelowe'],
    output: ['Approved searchable archive structure', 'Zatwierdzone, przeszukiwalne archiwum'],
    system: 'Local or cloud files',
    sourceKeys: ['openclawOfficial', 'hermesDocs'],
  },
  {
    slug: 'travel-document-readiness',
    title: ['Travel document readiness', 'Dokumenty podróżne gotowe przed wyjazdem'],
    oneLiner: ['Check passport validity, visa rules, insurance, and missing documents against the itinerary.', 'Sprawdza ważność paszportu, zasady wizowe, ubezpieczenie i braki względem planu podróży.'],
    category: 'travel',
    contexts: ['personal', 'freelance'],
    primaryUser: ['Traveler', 'Podróżny'],
    benefit: ['Missing paperwork is found before check-in.', 'Brakujące dokumenty wychodzą na jaw przed odprawą.'],
    complexity: 3,
    capabilities: ['vision', 'document-understanding', 'web-research', 'scheduled-monitoring', 'human-approval'],
    archetype: 'investigate-and-report',
    industries: ['travel'],
    trigger: ['A trip is booked or enters the document-check window.', 'Podróż zostaje zarezerwowana albo wchodzi w okres kontroli dokumentów.'],
    subject: ['itinerary, passport, visas, insurance, traveler nationality, and official rules', 'plan podróży, paszport, wizy, ubezpieczenie, obywatelstwo i oficjalne zasady'],
    decision: ['a dated readiness checklist with official sources', 'checklistę gotowości z terminami i oficjalnymi źródłami'],
    output: ['Traveler-approved document plan', 'Plan dokumentów zatwierdzony przez podróżnego'],
    system: 'Files, web, and calendar',
    sourceKeys: ['openaiAgentsTools', 'openclawCommunity'],
  },
  {
    slug: 'trip-price-drop-monitor',
    title: ['Trip price drop monitor', 'Lepsza cena lotu lub noclegu bez ciągłego sprawdzania'],
    oneLiner: ['Watch selected fares and stays, then alert only when a real saving beats your rules.', 'Śledzi wybrane loty i noclegi, a alarmuje tylko wtedy, gdy oszczędność spełnia Twoje warunki.'],
    category: 'travel',
    contexts: ['personal', 'freelance'],
    primaryUser: ['Traveler', 'Podróżny'],
    benefit: ['Useful price changes surface without daily searches.', 'Ważne zmiany ceny pojawiają się bez codziennego szukania.'],
    complexity: 3,
    capabilities: ['web-research', 'browser-actions', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['travel', 'hospitality'],
    trigger: ['A tracked fare or stay is refreshed on schedule.', 'Śledzona cena lotu lub noclegu jest odświeżana według harmonogramu.'],
    subject: ['route, dates, baggage, cancellation rules, stay requirements, and price history', 'trasę, daty, bagaż, zasady anulowania, wymagania noclegu i historię ceny'],
    decision: ['an alert only when comparable total cost crosses the user threshold', 'alert tylko wtedy, gdy porównywalny koszt całkowity przekracza próg użytkownika'],
    output: ['Cited price-drop alert and booking link', 'Alert o spadku ceny ze źródłem i linkiem do rezerwacji'],
    system: 'Web browser and calendar',
    sourceKeys: ['openaiOperator', 'hermesDocs'],
  },
  {
    slug: 'multi-stop-trip-planner',
    title: ['Multi-stop trip planner', 'Wieloodcinkowa podróż, która mieści się w czasie i budżecie'],
    oneLiner: ['Build and compare complete route options instead of optimizing each booking in isolation.', 'Buduje i porównuje pełne warianty trasy zamiast optymalizować każdą rezerwację osobno.'],
    category: 'travel',
    contexts: ['personal', 'freelance'],
    primaryUser: ['Independent traveler', 'Osoba samodzielnie planująca podróż'],
    benefit: ['Fewer impossible connections and hidden total costs.', 'Mniej nierealnych przesiadek i ukrytych kosztów całej trasy.'],
    complexity: 3,
    capabilities: ['web-research', 'browser-actions', 'multi-step-planning', 'human-approval'],
    archetype: 'investigate-and-report',
    industries: ['travel'],
    trigger: ['The user provides destinations, dates, constraints, and budget.', 'Użytkownik podaje miejsca, daty, ograniczenia i budżet.'],
    subject: ['transport, stays, transfer time, entry rules, preferences, and total cost', 'transport, noclegi, czas przesiadek, zasady wjazdu, preferencje i koszt całkowity'],
    decision: ['ranked complete itineraries with trade-offs and source links', 'ranking pełnych tras z kompromisami i linkami do źródeł'],
    output: ['User-approved itinerary ready for booking', 'Plan podróży zatwierdzony i gotowy do rezerwacji'],
    system: 'Web browser and maps',
    sourceKeys: ['openaiOperator', 'openaiAgentsTools'],
  },
  {
    slug: 'travel-receipt-expense-pack',
    title: ['Travel receipt expense pack', 'Rozliczenie podróży bez szukania paragonów'],
    oneLiner: ['Match receipts to bookings and card charges, flag gaps, and prepare a review-ready expense pack.', 'Łączy paragony z rezerwacjami i płatnościami, pokazuje braki i przygotowuje kompletne rozliczenie.'],
    category: 'travel',
    contexts: ['freelance', 'small-business', 'team'],
    primaryUser: ['Business traveler or freelancer', 'Osoba podróżująca służbowo lub freelancer'],
    benefit: ['Expenses are ready sooner with fewer missing receipts.', 'Rozliczenie jest gotowe szybciej i ma mniej brakujących paragonów.'],
    complexity: 2,
    capabilities: ['vision', 'document-understanding', 'tool-use', 'human-approval'],
    archetype: 'reconcile-and-flag',
    industries: ['professional services', 'travel'],
    trigger: ['A trip ends or a new travel receipt arrives.', 'Podróż się kończy albo pojawia się nowy paragon.'],
    subject: ['receipts, itinerary, card charges, expense policy, and project code', 'paragony, plan podróży, płatności kartą, politykę wydatków i kod projektu'],
    decision: ['matched expenses, missing evidence, and policy exceptions', 'dopasowane wydatki, brakujące dowody i wyjątki od polityki'],
    output: ['Approved travel expense package', 'Zatwierdzony pakiet rozliczenia podróży'],
    system: 'Email, photos, and accounting',
    sourceKeys: ['openclawCommunity', 'n8nCases'],
  },
  {
    slug: 'loyalty-points-expiry-watch',
    title: ['Loyalty points expiry watch', 'Punkty i mile wykorzystane przed wygaśnięciem'],
    oneLiner: ['Track balances, expiry rules, and useful redemption windows across loyalty programs.', 'Śledzi salda, zasady wygaśnięcia i sensowne terminy wykorzystania w programach lojalnościowych.'],
    category: 'travel',
    contexts: ['personal'],
    primaryUser: ['Loyalty-program member', 'Uczestnik programów lojalnościowych'],
    benefit: ['Valuable points do not disappear unnoticed.', 'Wartościowe punkty nie przepadają bez ostrzeżenia.'],
    complexity: 2,
    capabilities: ['browser-actions', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['travel', 'financial services'],
    trigger: ['A loyalty balance is refreshed or points enter the expiry window.', 'Saldo programu jest odświeżane albo punkty wchodzą w okres wygaśnięcia.'],
    subject: ['program balances, expiry rules, travel plans, and redemption preferences', 'salda programów, zasady wygaśnięcia, plany podróży i preferencje wykorzystania'],
    decision: ['a useful redemption or preservation option before expiry', 'sensowną opcję wykorzystania lub zachowania punktów przed wygaśnięciem'],
    output: ['Approved points action and reminder', 'Zatwierdzona akcja dotycząca punktów i przypomnienie'],
    system: 'Loyalty portals and calendar',
    sourceKeys: ['openaiOperator', 'openclawCommunity'],
  },
  {
    slug: 'freelance-client-onboarding-chase',
    title: ['Freelance client onboarding chase', 'Start projektu bez tygodni czekania na materiały'],
    oneLiner: ['Track contracts, access, files, and answers, then follow up on exactly what is missing.', 'Pilnuje umowy, dostępów, plików i odpowiedzi, a potem przypomina tylko o konkretnych brakach.'],
    category: 'operations',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer or agency owner', 'Freelancer lub właściciel małej agencji'],
    benefit: ['Client work starts with fewer delays and fewer vague reminder emails.', 'Praca dla klienta rusza szybciej, bez ogólnych maili z przypomnieniem.'],
    complexity: 2,
    capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'orchestrate-multi-step',
    industries: ['professional services', 'creative services'],
    trigger: ['A client accepts the engagement and onboarding begins.', 'Klient akceptuje współpracę i zaczyna się onboarding.'],
    subject: ['onboarding checklist, contract, files, credentials, answers, and due dates', 'checklistę startową, umowę, pliki, dostępy, odpowiedzi i terminy'],
    decision: ['the next missing item and a specific follow-up draft', 'następny brakujący element i konkretny szkic przypomnienia'],
    output: ['Complete client onboarding pack', 'Kompletny pakiet startowy klienta'],
    system: 'Email, files, and project tracker',
    sourceKeys: ['n8nBordr', 'openclawOperations'],
  },
  {
    slug: 'freelance-scope-creep-watch',
    title: ['Freelance scope creep watch', 'Dodatkowa praca zauważona, zanim zje marżę'],
    oneLiner: ['Compare new requests with the agreed scope and prepare a factual change note.', 'Porównuje nowe prośby z uzgodnionym zakresem i przygotowuje rzeczową informację o zmianie.'],
    category: 'operations',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer or project lead', 'Freelancer lub osoba prowadząca projekt'],
    benefit: ['Unpaid extras become visible while there is still time to agree terms.', 'Niepłatne dodatki są widoczne, gdy nadal można uzgodnić warunki.'],
    complexity: 2,
    capabilities: ['document-understanding', 'memory', 'tool-use', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['professional services', 'creative services', 'software'],
    trigger: ['A client adds a new request, revision, or deliverable.', 'Klient dodaje nową prośbę, poprawkę lub rezultat.'],
    subject: ['signed scope, change history, client messages, tasks, and time spent', 'uzgodniony zakres, historię zmian, wiadomości klienta, zadania i czas pracy'],
    decision: ['in-scope, ambiguous, or change-request classification with evidence', 'klasyfikację w zakresie, niejasne lub wymagające zmiany wraz z dowodami'],
    output: ['Approved scope-change note and updated tracker', 'Zatwierdzona informacja o zmianie zakresu i zaktualizowany tracker'],
    system: 'Email and project tracker',
    sourceKeys: ['openclawCommunity', 'n8nCases'],
  },
  {
    slug: 'freelance-overdue-invoice-followup',
    title: ['Freelance overdue invoice follow-up', 'Zaległa faktura z właściwym przypomnieniem'],
    oneLiner: ['Check payment status, prior promises, and tone before drafting the next reminder.', 'Sprawdza płatność, wcześniejsze deklaracje i ton rozmowy przed przygotowaniem kolejnego przypomnienia.'],
    category: 'finance',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer or small-business owner', 'Freelancer lub właściciel małej firmy'],
    benefit: ['Late invoices get consistent follow-up without damaging the client relationship.', 'Zaległe faktury są konsekwentnie przypominane bez psucia relacji z klientem.'],
    complexity: 2,
    capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'draft-and-approve',
    industries: ['professional services'],
    trigger: ['An invoice passes its due date without a matched payment.', 'Faktura przekracza termin bez dopasowanej płatności.'],
    subject: ['invoice, due date, payment feed, client history, and prior reminders', 'fakturę, termin, dane płatności, historię klienta i wcześniejsze przypomnienia'],
    decision: ['the next reminder, escalation level, and promised payment date', 'kolejne przypomnienie, poziom eskalacji i obiecaną datę płatności'],
    output: ['Approved payment reminder and updated status', 'Zatwierdzone przypomnienie o płatności i aktualny status'],
    system: 'Accounting and email',
    sourceKeys: ['n8nCases', 'openclawCommunity'],
  },
  {
    slug: 'freelance-receipt-bookkeeping',
    title: ['Freelance receipt bookkeeping', 'Paragony gotowe dla księgowości'],
    oneLiner: ['Read receipts, match card charges, suggest categories, and isolate uncertain expenses.', 'Odczytuje paragony, dopasowuje płatności, proponuje kategorie i oddziela niepewne wydatki.'],
    category: 'finance',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer or bookkeeper', 'Freelancer lub księgowa'],
    benefit: ['Month-end expense preparation takes less manual sorting.', 'Przygotowanie kosztów na koniec miesiąca wymaga mniej ręcznego sortowania.'],
    complexity: 2,
    capabilities: ['vision', 'document-understanding', 'tool-use', 'human-approval'],
    archetype: 'reconcile-and-flag',
    industries: ['professional services'],
    trigger: ['A receipt arrives or the monthly bookkeeping review starts.', 'Pojawia się paragon albo zaczyna się miesięczny przegląd księgowy.'],
    subject: ['receipt images, card transactions, tax categories, client, and project', 'zdjęcia paragonów, transakcje kartą, kategorie podatkowe, klienta i projekt'],
    decision: ['a matched expense, suggested category, or review exception', 'dopasowany wydatek, sugerowaną kategorię lub wyjątek do sprawdzenia'],
    output: ['Reviewer-approved expense ledger', 'Rejestr wydatków zatwierdzony po przeglądzie'],
    system: 'Accounting and cloud files',
    sourceKeys: ['openclawCommunity', 'n8nCases'],
  },
  {
    slug: 'freelance-contract-obligation-watch',
    title: ['Freelance contract obligation watch', 'Terminy i zobowiązania z umów pod kontrolą'],
    oneLiner: ['Extract notice periods, deliverables, renewal dates, and client obligations into one calendar.', 'Wyciąga okresy wypowiedzenia, rezultaty, daty odnowienia i obowiązki klienta do jednego kalendarza.'],
    category: 'legal-compliance',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer or agency owner', 'Freelancer lub właściciel agencji'],
    benefit: ['Important contract dates stop living only inside PDFs.', 'Ważne daty umowne nie pozostają ukryte wyłącznie w PDF-ach.'],
    complexity: 3,
    capabilities: ['document-understanding', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['professional services', 'creative services'],
    trigger: ['A signed contract is added or an obligation enters its reminder window.', 'Dodano podpisaną umowę albo zobowiązanie wchodzi w okres przypomnienia.'],
    subject: ['signed contract, amendments, deliverables, dates, and notice clauses', 'podpisaną umowę, aneksy, rezultaty, daty i klauzule wypowiedzenia'],
    decision: ['a cited obligation, owner, and action date', 'cytowane zobowiązanie, ownera i datę działania'],
    output: ['Approved obligation register and reminders', 'Zatwierdzony rejestr zobowiązań i przypomnienia'],
    system: 'Files and calendar',
    sourceKeys: ['openclawCommunity', 'openaiAgentsTools'],
  },
  {
    slug: 'creator-sponsor-deliverable-tracker',
    title: ['Creator sponsor deliverable tracker', 'Materiały sponsorskie oddane na czas'],
    oneLiner: ['Track promised mentions, formats, approvals, links, and publication dates per sponsor.', 'Pilnuje obiecanych wzmianek, formatów, akceptacji, linków i dat publikacji dla każdego sponsora.'],
    category: 'creator',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Creator or sponsorship manager', 'Twórca lub osoba obsługująca sponsorów'],
    benefit: ['Fewer missed deliverables and awkward sponsor follow-ups.', 'Mniej pominiętych zobowiązań i niezręcznych przypomnień od sponsora.'],
    complexity: 2,
    capabilities: ['document-understanding', 'memory', 'scheduled-monitoring', 'tool-use', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['creator economy', 'media'],
    trigger: ['A sponsorship agreement is signed or a deliverable nears its due date.', 'Umowa sponsorska zostaje podpisana albo zbliża się termin materiału.'],
    subject: ['agreement, deliverable list, content calendar, approvals, and tracking links', 'umowę, listę materiałów, kalendarz treści, akceptacje i linki śledzące'],
    decision: ['the next sponsor deliverable, blocker, and owner', 'następny materiał sponsorski, blocker i ownera'],
    output: ['Current sponsor delivery board', 'Aktualna tablica realizacji dla sponsorów'],
    system: 'Files, calendar, and project tracker',
    sourceKeys: ['openclawOperations', 'hermesDocs'],
  },
  {
    slug: 'creator-audience-theme-digest',
    title: ['Creator audience theme digest', 'Najważniejsze pytania odbiorców w jednym przeglądzie'],
    oneLiner: ['Group comments, emails, and messages into recurring needs with links to the originals.', 'Grupuje komentarze, e-maile i wiadomości w powtarzające się potrzeby z linkami do oryginałów.'],
    category: 'creator',
    contexts: ['freelance', 'small-business', 'team'],
    primaryUser: ['Creator or community lead', 'Twórca lub osoba prowadząca społeczność'],
    benefit: ['Content decisions come from repeated audience signals, not the loudest comment.', 'Decyzje o treściach wynikają z powtarzalnych sygnałów, a nie z najgłośniejszego komentarza.'],
    complexity: 3,
    capabilities: ['tool-use', 'memory', 'multi-agent', 'document-understanding', 'human-approval'],
    archetype: 'investigate-and-report',
    industries: ['creator economy', 'media'],
    trigger: ['The weekly audience-insight review starts.', 'Zaczyna się cotygodniowy przegląd głosu odbiorców.'],
    subject: ['comments, direct messages, support emails, tags, and prior themes', 'komentarze, wiadomości prywatne, e-maile, tagi i wcześniejsze tematy'],
    decision: ['recurring themes, representative examples, and open questions', 'powtarzalne tematy, reprezentatywne przykłady i otwarte pytania'],
    output: ['Cited weekly audience digest', 'Cotygodniowy przegląd odbiorców ze źródłami'],
    system: 'Social platforms and email',
    sourceKeys: ['langfuseDigest', 'openclawOperations'],
  },
  {
    slug: 'video-footage-clip-finder',
    title: ['Video footage clip finder', 'Właściwe ujęcia znalezione bez przewijania godzin nagrań'],
    oneLiner: ['Search video by spoken words, visible objects, people, and scene changes.', 'Przeszukuje wideo po wypowiedziach, widocznych obiektach, osobach i zmianach scen.'],
    category: 'creator',
    contexts: ['freelance', 'small-business', 'team'],
    primaryUser: ['Video editor or creator', 'Montażysta lub twórca wideo'],
    benefit: ['Editors reach usable source clips much faster.', 'Montażyści znacznie szybciej docierają do użytecznych ujęć.'],
    complexity: 3,
    capabilities: ['vision', 'transcription', 'document-understanding', 'memory'],
    archetype: 'enrich-and-route',
    industries: ['media', 'creator economy'],
    trigger: ['A new recording batch is ingested or an editor submits a clip query.', 'Dodano nową partię nagrań albo montażysta wpisuje zapytanie o ujęcie.'],
    subject: ['video, transcript, speakers, objects, scenes, and project taxonomy', 'wideo, transkrypt, mówców, obiekty, sceny i taksonomię projektu'],
    decision: ['ranked source clips with exact timecodes and match reasons', 'ranking ujęć z dokładnymi timecode’ami i powodami dopasowania'],
    output: ['Searchable clip shortlist', 'Przeszukiwalna krótka lista ujęć'],
    system: 'Media storage and editor',
    sourceKeys: ['hermesDocs', 'openaiAgentsTools'],
  },
  {
    slug: 'creator-rights-expiry-watch',
    title: ['Creator rights expiry watch', 'Muzyka, zdjęcia i licencje użyte legalnie'],
    oneLiner: ['Track usage rights, territories, channels, and expiry dates before content is reused.', 'Pilnuje praw użycia, terytoriów, kanałów i dat wygaśnięcia przed ponowną publikacją.'],
    category: 'creator',
    contexts: ['freelance', 'small-business', 'team'],
    primaryUser: ['Creator or content producer', 'Twórca lub producent treści'],
    benefit: ['Expired or channel-limited assets are caught before publication.', 'Wygasłe lub ograniczone do kanału materiały są wykrywane przed publikacją.'],
    complexity: 3,
    capabilities: ['document-understanding', 'vision', 'memory', 'scheduled-monitoring', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['media', 'advertising', 'creator economy'],
    trigger: ['An asset is selected for reuse or its rights enter the expiry window.', 'Materiał zostaje wybrany do ponownego użycia albo prawa wchodzą w okres wygaśnięcia.'],
    subject: ['asset, license, contract, territory, channel, campaign, and publication date', 'materiał, licencję, umowę, terytorium, kanał, kampanię i datę publikacji'],
    decision: ['allowed use, required clearance, or replacement recommendation', 'dozwolone użycie, wymaganą zgodę lub rekomendację zamiany'],
    output: ['Rights-checked asset decision', 'Decyzja o użyciu materiału po kontroli praw'],
    system: 'Digital asset manager',
    sourceKeys: ['openclawOfficial', 'openaiAgentsTools'],
  },
  {
    slug: 'master-content-platform-pack',
    title: ['Master content to platform pack', 'Jedna gotowa treść dopasowana do każdego kanału'],
    oneLiner: ['Turn an approved master asset into platform-specific copy, crops, captions, and metadata.', 'Zamienia zatwierdzony materiał główny w copy, kadry, napisy i metadata dla konkretnych platform.'],
    category: 'creator',
    contexts: ['freelance', 'small-business', 'team'],
    primaryUser: ['Creator or social media manager', 'Twórca lub social media manager'],
    benefit: ['Publishing variants stay consistent without rebuilding the content from scratch.', 'Warianty publikacyjne pozostają spójne bez tworzenia treści od zera.'],
    complexity: 3,
    capabilities: ['vision', 'transcription', 'document-understanding', 'tool-use', 'human-approval'],
    archetype: 'draft-and-approve',
    industries: ['creator economy', 'media', 'marketing'],
    trigger: ['A master video, article, or campaign asset is approved.', 'Główny film, artykuł lub materiał kampanii zostaje zatwierdzony.'],
    subject: ['approved master asset, brand rules, platform specifications, and rights', 'zatwierdzony materiał, zasady marki, wymagania platform i prawa użycia'],
    decision: ['platform-ready variants with traceable changes', 'warianty gotowe dla platform z widocznymi zmianami'],
    output: ['Approved cross-platform publishing pack', 'Zatwierdzony pakiet publikacyjny na wiele platform'],
    system: 'Content manager and social scheduler',
    sourceKeys: ['openaiAgentsTools', 'hermesDocs'],
  },
  {
    slug: 'supplier-assets-to-product-listing',
    title: ['Supplier assets to product listing', 'Karta produktu gotowa z plików dostawcy'],
    oneLiner: ['Turn supplier PDFs, photos, and spreadsheets into a review-ready product listing.', 'Zamienia PDF-y, zdjęcia i arkusze dostawcy w kartę produktu gotową do sprawdzenia.'],
    category: 'creator',
    contexts: ['small-business', 'team'],
    primaryUser: ['Ecommerce owner or catalog manager', 'Właściciel ecommerce lub opiekun katalogu'],
    benefit: ['New products reach the catalog with less copying and fewer missing fields.', 'Nowe produkty trafiają do katalogu z mniejszą ilością przepisywania i braków.'],
    complexity: 3,
    capabilities: ['vision', 'document-understanding', 'tool-use', 'human-approval'],
    archetype: 'draft-and-approve',
    industries: ['ecommerce', 'retail'],
    trigger: ['A supplier sends a new product data package.', 'Dostawca przesyła nowy pakiet danych produktu.'],
    subject: ['supplier sheets, PDFs, photos, taxonomy, required fields, and brand rules', 'arkusze, PDF-y, zdjęcia, taksonomię, wymagane pola i zasady marki'],
    decision: ['a normalized listing with missing facts clearly marked', 'znormalizowaną kartę z wyraźnie oznaczonymi brakami'],
    output: ['Approved staged product listing', 'Zatwierdzona karta produktu w stagingu'],
    system: 'Ecommerce platform',
    sourceKeys: ['n8nCases', 'openaiAgentsTools'],
  },
  {
    slug: 'freelance-capacity-risk-watch',
    title: ['Freelance capacity risk watch', 'Przeciążenie widoczne przed spóźnionym terminem'],
    oneLiner: ['Compare commitments, remaining work, dependencies, and available hours across clients.', 'Porównuje zobowiązania, pozostałą pracę, zależności i dostępne godziny między klientami.'],
    category: 'operations',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer or small-team lead', 'Freelancer lub lider małego zespołu'],
    benefit: ['Deadline risk surfaces while work can still be renegotiated.', 'Ryzyko terminu pojawia się, gdy pracę nadal można przeplanować.'],
    complexity: 2,
    capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'multi-step-planning', 'human-approval'],
    archetype: 'monitor-and-alert',
    industries: ['professional services', 'creative services'],
    trigger: ['A task estimate, deadline, dependency, or available-hours plan changes.', 'Zmienia się estymacja, termin, zależność lub plan dostępnych godzin.'],
    subject: ['projects, tasks, estimates, deadlines, dependencies, and calendar capacity', 'projekty, zadania, estymacje, terminy, zależności i dostępność w kalendarzu'],
    decision: ['the earliest material capacity risk and realistic recovery options', 'najwcześniejsze istotne ryzyko przeciążenia i realne opcje wyjścia'],
    output: ['Approved workload adjustment plan', 'Zatwierdzony plan korekty obciążenia'],
    system: 'Project tracker and calendar',
    sourceKeys: ['openclawOperations', 'hermesDocs'],
  },
  {
    slug: 'portfolio-case-study-builder',
    title: ['Portfolio case study builder', 'Opis projektu z dowodami zamiast pustych sloganów'],
    oneLiner: ['Collect project artifacts, decisions, and measured outcomes into a client-approved story.', 'Zbiera materiały projektu, decyzje i zmierzone wyniki w historię zatwierdzoną przez klienta.'],
    category: 'creator',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Freelancer, designer, or agency owner', 'Freelancer, projektant lub właściciel agencji'],
    benefit: ['Finished work becomes a credible portfolio asset faster.', 'Zakończony projekt szybciej staje się wiarygodnym materiałem portfolio.'],
    complexity: 2,
    capabilities: ['document-understanding', 'vision', 'tool-use', 'human-approval'],
    archetype: 'draft-and-approve',
    industries: ['professional services', 'creative services'],
    trigger: ['A project closes and its publication permissions are known.', 'Projekt się kończy i znane są zgody na publikację.'],
    subject: ['brief, project files, decisions, feedback, outcomes, and confidentiality limits', 'brief, pliki projektu, decyzje, feedback, wyniki i ograniczenia poufności'],
    decision: ['a factual case-study draft with unsupported claims removed', 'rzeczowy szkic case study bez niepotwierdzonych tez'],
    output: ['Client-approved portfolio case study', 'Opis projektu do portfolio zatwierdzony przez klienta'],
    system: 'Files and CMS',
    sourceKeys: ['openaiAgentsTools', 'openclawOperations'],
  },
  {
    slug: 'creator-revenue-reconciliation',
    title: ['Creator revenue reconciliation', 'Pełny obraz przychodów z wielu platform'],
    oneLiner: ['Match payouts, affiliate reports, sponsorship invoices, and platform fees to the ledger.', 'Dopasowuje wypłaty, raporty afiliacyjne, faktury sponsorskie i prowizje platform do księgi.'],
    category: 'finance',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Creator or creator bookkeeper', 'Twórca lub księgowa twórcy'],
    benefit: ['Missing payouts and unexplained fee differences become visible.', 'Brakujące wypłaty i niewyjaśnione różnice prowizji stają się widoczne.'],
    complexity: 3,
    capabilities: ['document-understanding', 'browser-actions', 'tool-use', 'memory', 'human-approval'],
    archetype: 'reconcile-and-flag',
    industries: ['creator economy', 'media'],
    trigger: ['A platform payout or monthly revenue report arrives.', 'Przychodzi wypłata z platformy albo miesięczny raport przychodów.'],
    subject: ['platform reports, bank payouts, affiliate statements, invoices, fees, and tax currency', 'raporty platform, wypłaty bankowe, zestawienia afiliacyjne, faktury, prowizje i walutę podatkową'],
    decision: ['matched revenue, fee differences, and missing payouts', 'dopasowane przychody, różnice prowizji i brakujące wypłaty'],
    output: ['Reviewer-approved creator revenue ledger', 'Rejestr przychodów twórcy zatwierdzony po przeglądzie'],
    system: 'Platform portals and accounting',
    sourceKeys: ['openclawCommunity', 'n8nCases'],
  },
  {
    slug: 'brand-deal-fit-research',
    title: ['Brand deal fit research', 'Współprace sponsorskie dopasowane do twórcy i odbiorców'],
    oneLiner: ['Check the brand, offer, reputation, audience fit, and contract red flags before replying.', 'Sprawdza markę, ofertę, reputację, dopasowanie do odbiorców i ryzyka umowy przed odpowiedzią.'],
    category: 'research',
    contexts: ['freelance', 'small-business'],
    primaryUser: ['Creator or talent manager', 'Twórca lub manager talentu'],
    benefit: ['Weak or risky partnerships are filtered before negotiation consumes time.', 'Słabe lub ryzykowne współprace odpadają, zanim negocjacje zabiorą czas.'],
    complexity: 3,
    capabilities: ['web-research', 'document-understanding', 'memory', 'human-approval'],
    archetype: 'investigate-and-report',
    industries: ['creator economy', 'advertising'],
    trigger: ['A creator receives a sponsorship inquiry or draft agreement.', 'Twórca otrzymuje zapytanie sponsorskie lub projekt umowy.'],
    subject: ['brand, product, campaign brief, proposed terms, audience, and public reputation', 'markę, produkt, brief kampanii, proponowane warunki, odbiorców i reputację publiczną'],
    decision: ['a cited fit assessment, red flags, and unanswered questions', 'ocenę dopasowania ze źródłami, czerwone flagi i pytania bez odpowiedzi'],
    output: ['Creator-reviewed partnership brief', 'Brief współpracy sprawdzony przez twórcę'],
    system: 'Web, email, and files',
    sourceKeys: ['openaiShopping', 'openaiAgentsTools'],
  },
  {
    slug: 'client-deliverable-quality-gate',
    title: ['Client deliverable quality gate', 'Błędy w materiale znalezione przed klientem'],
    oneLiner: ['Check the final deliverable against the brief, acceptance criteria, links, and brand rules.', 'Sprawdza finalny materiał względem briefu, kryteriów odbioru, linków i zasad marki.'],
    category: 'operations',
    contexts: ['freelance', 'small-business', 'team'],
    primaryUser: ['Freelancer or delivery lead', 'Freelancer lub osoba odpowiedzialna za dostarczenie'],
    benefit: ['Fewer avoidable revisions and embarrassing handoff mistakes.', 'Mniej zbędnych poprawek i wpadek przy przekazaniu pracy.'],
    complexity: 2,
    capabilities: ['document-understanding', 'vision', 'tool-use', 'human-approval'],
    archetype: 'investigate-and-report',
    industries: ['professional services', 'creative services', 'software'],
    trigger: ['A deliverable enters final review before client handoff.', 'Materiał trafia do finalnego przeglądu przed wysyłką do klienta.'],
    subject: ['final files, approved brief, acceptance criteria, brand rules, and prior feedback', 'finalne pliki, zatwierdzony brief, kryteria odbioru, zasady marki i wcześniejszy feedback'],
    decision: ['a pass, fix, or clarify list with exact evidence', 'listę gotowe, popraw lub wyjaśnij z dokładnymi dowodami'],
    output: ['Approved client delivery package', 'Zatwierdzony pakiet do wysyłki klientowi'],
    system: 'Files and project tracker',
    sourceKeys: ['openaiAgentsTools', 'langfuseEvaluation'],
  },
  { slug: 'missed-call-to-booked-visit', title: ['Missed call to booked visit', 'Nieodebrane połączenie zamienione w umówioną wizytę'], oneLiner: ['Identify the caller, understand the request, and prepare an available appointment for approval.', 'Rozpoznaje dzwoniącego, ustala potrzebę i przygotowuje dostępny termin do potwierdzenia.'], category: 'sales', contexts: ['small-business'], primaryUser: ['Local service owner', 'Właściciel lokalnej firmy usługowej'], benefit: ['Fewer valuable calls disappear after business hours.', 'Mniej wartościowych telefonów przepada po godzinach pracy.'], complexity: 3, capabilities: ['transcription', 'tool-use', 'memory', 'human-approval'], archetype: 'enrich-and-route', industries: ['home services', 'healthcare', 'beauty'], trigger: ['A business call is missed or reaches voicemail.', 'Połączenie firmowe nie zostaje odebrane lub trafia na pocztę głosową.'], subject: ['caller, voicemail, service area, service type, urgency, and calendar', 'dzwoniącego, wiadomość głosową, obszar, usługę, pilność i kalendarz'], decision: ['a qualified callback or available appointment option', 'kwalifikowany callback lub dostępny termin wizyty'], output: ['Approved callback task or booking', 'Zatwierdzone zadanie oddzwonienia lub rezerwacja'], system: 'Phone and calendar', sourceKeys: ['n8nCases', 'openclawOperations'] },
  { slug: 'appointment-no-show-recovery', title: ['Appointment no-show recovery', 'Wolny termin szybko wraca do kalendarza'], oneLiner: ['Detect a no-show, offer the right rebooking options, and notify the waitlist after approval.', 'Wykrywa nieobecność, proponuje właściwe nowe terminy i po akceptacji powiadamia listę oczekujących.'], category: 'operations', contexts: ['small-business'], primaryUser: ['Appointment-based business owner', 'Właściciel firmy pracującej na wizytach'], benefit: ['Empty slots are recovered with less manual calling.', 'Puste okienka są odzyskiwane bez ręcznego obdzwonienia klientów.'], complexity: 3, capabilities: ['tool-use', 'memory', 'multi-step-planning', 'human-approval'], archetype: 'orchestrate-multi-step', industries: ['healthcare', 'beauty', 'professional services'], trigger: ['A booked customer does not check in within the allowed window.', 'Umówiony klient nie pojawia się w ustalonym oknie.'], subject: ['booking, cancellation policy, customer preferences, open slots, and waitlist', 'rezerwację, zasady anulowania, preferencje klienta, wolne terminy i listę oczekujących'], decision: ['a rebooking path and the next eligible waitlist contact', 'ścieżkę ponownej rezerwacji i następną osobę z listy oczekujących'], output: ['Approved rebooking and waitlist messages', 'Zatwierdzone wiadomości o nowym terminie i wolnym miejscu'], system: 'Booking system and messaging', sourceKeys: ['n8nCases', 'openaiAgentsTools'] },
  { slug: 'customer-review-response', title: ['Customer review response', 'Opinie klientów obsłużone, zanim przerodzą się w kryzys'], oneLiner: ['Find new reviews, check the customer history, and draft a factual response or private escalation.', 'Znajduje nowe opinie, sprawdza historię klienta i przygotowuje rzeczową odpowiedź lub prywatną eskalację.'], category: 'customer-support', contexts: ['small-business', 'team'], primaryUser: ['Local business owner or service manager', 'Właściciel lokalnej firmy lub manager obsługi'], benefit: ['Public feedback gets a timely, consistent response.', 'Każda publiczna opinia szybko dostaje spójną odpowiedź.'], complexity: 2, capabilities: ['web-research', 'tool-use', 'memory', 'human-approval'], archetype: 'draft-and-approve', industries: ['hospitality', 'retail', 'home services'], trigger: ['A new public review is posted.', 'Pojawia się nowa publiczna opinia.'], subject: ['review, customer record, service history, response policy, and prior contact', 'opinię, rekord klienta, historię usługi, zasady odpowiedzi i wcześniejszy kontakt'], decision: ['a public reply or private recovery escalation', 'publiczną odpowiedź lub prywatną eskalację naprawczą'], output: ['Owner-approved review response', 'Odpowiedź na opinię zatwierdzona przez właściciela'], system: 'Review platforms and CRM', sourceKeys: ['n8nCases', 'openaiAgentsTools'] },
  { slug: 'small-business-quote-followup', title: ['Small-business quote follow-up', 'Wycena nie ginie po wysłaniu'], oneLiner: ['Track each quote, customer response, and expiry date, then prepare the right follow-up.', 'Śledzi każdą wycenę, odpowiedź klienta i termin ważności, a potem przygotowuje właściwe przypomnienie.'], category: 'sales', contexts: ['small-business'], primaryUser: ['Small-business owner or salesperson', 'Właściciel małej firmy lub sprzedawca'], benefit: ['Promising quotes receive follow-up without nagging every customer.', 'Obiecujące wyceny są przypominane bez nękania każdego klienta.'], complexity: 2, capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'human-approval'], archetype: 'monitor-and-alert', industries: ['home services', 'construction', 'professional services'], trigger: ['A sent quote reaches its follow-up date without a decision.', 'Mija termin przypomnienia o wysłanej wycenie, a klient nadal nie podjął decyzji.'], subject: ['quote, customer messages, validity date, project timing, and prior follow-ups', 'wycenę, wiadomości klienta, termin ważności, harmonogram projektu i wcześniejsze przypomnienia'], decision: ['the next useful follow-up or a close-lost recommendation', 'następne sensowne przypomnienie lub rekomendację zamknięcia sprawy'], output: ['Approved quote follow-up and status', 'Zatwierdzone przypomnienie o wycenie i aktualny status'], system: 'CRM and email', sourceKeys: ['n8nCases', 'openclawCommunity'] },
  { slug: 'small-business-stock-reorder-watch', title: ['Small-business stock reorder watch', 'Towar zamówiony przed wyczerpaniem zapasu'], oneLiner: ['Watch sales velocity, lead time, current stock, and minimum order rules before suggesting a reorder.', 'Śledzi tempo sprzedaży, czas dostawy, zapas i minima zamówień przed propozycją zakupu.'], category: 'operations', contexts: ['small-business', 'team'], primaryUser: ['Retail or ecommerce owner', 'Właściciel sklepu lub ecommerce'], benefit: ['Fewer stockouts without blindly over-ordering.', 'Mniej braków towaru bez zamawiania na zapas w ciemno.'], complexity: 3, capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'human-approval'], archetype: 'monitor-and-alert', industries: ['retail', 'ecommerce'], trigger: ['Stock cover crosses the approved reorder threshold.', 'Pokrycie zapasu spada poniżej zatwierdzonego progu.'], subject: ['stock, sales velocity, open orders, lead time, seasonality, and supplier minimums', 'zapas, tempo sprzedaży, otwarte zamówienia, czas dostawy, sezonowość i minima dostawcy'], decision: ['a bounded reorder quantity and timing with assumptions', 'ograniczoną ilość i termin zamówienia wraz z założeniami'], output: ['Owner-approved purchase suggestion', 'Propozycja zakupu zatwierdzona przez właściciela'], system: 'Inventory and accounting', sourceKeys: ['n8nCases', 'openclawOperations'] },
  { slug: 'small-business-daily-cash-brief', title: ['Small-business daily cash brief', 'Poranny obraz gotówki, sprzedaży i pilnych problemów'], oneLiner: ['Reconcile yesterday’s sales, payouts, refunds, and bills into one short owner brief.', 'Uzgadnia wczorajszą sprzedaż, wypłaty, zwroty i rachunki w jednym krótkim przeglądzie dla właściciela.'], category: 'finance', contexts: ['small-business'], primaryUser: ['Small-business owner', 'Właściciel małej firmy'], benefit: ['The owner sees cash surprises before starting the day.', 'Właściciel widzi niespodzianki w gotówce przed rozpoczęciem dnia.'], complexity: 3, capabilities: ['tool-use', 'document-understanding', 'memory', 'scheduled-monitoring', 'human-approval'], archetype: 'reconcile-and-flag', industries: ['retail', 'hospitality', 'ecommerce'], trigger: ['The daily finance review runs after payment feeds settle.', 'Codzienny przegląd finansów uruchamia się po zaksięgowaniu danych płatniczych.'], subject: ['sales, payment payouts, refunds, bank activity, bills, and prior baseline', 'sprzedaż, wypłaty operatorów, zwroty, aktywność bankową, rachunki i wcześniejszy poziom'], decision: ['matched cash movement, material differences, and today’s action list', 'uzgodnione przepływy, istotne różnice i listę działań na dziś'], output: ['Reviewed daily owner cash brief', 'Sprawdzony dzienny przegląd gotówki dla właściciela'], system: 'POS, bank, and accounting', sourceKeys: ['openclawCommunity', 'n8nCases'] },
  { slug: 'small-team-shared-inbox-routing', title: ['Small-team shared inbox routing', 'Każda wiadomość od klienta ma właściwego opiekuna'], oneLiner: ['Recognize the customer and request, find the right owner, and flag messages that need a fast response.', 'Rozpoznaje klienta i sprawę, wybiera właściwego opiekuna i oznacza wiadomości wymagające szybkiej reakcji.'], category: 'customer-support', contexts: ['small-business', 'team'], primaryUser: ['Small support or operations team', 'Mały zespół obsługi lub operacji'], benefit: ['Requests stop bouncing between people or sitting unowned.', 'Zgłoszenia nie krążą między ludźmi i nie zostają bez opiekuna.'], complexity: 2, capabilities: ['tool-use', 'memory', 'human-approval'], archetype: 'enrich-and-route', industries: ['professional services', 'ecommerce', 'software'], trigger: ['A new message reaches the shared inbox.', 'Nowa wiadomość trafia do wspólnej skrzynki.'], subject: ['message, sender, customer history, topic, urgency, and team ownership rules', 'wiadomość, nadawcę, historię klienta, temat, pilność i zasady przypisywania spraw'], decision: ['the right owner, priority, and suggested first action', 'właściwego opiekuna, priorytet i sugerowane pierwsze działanie'], output: ['Approved assignment and response deadline', 'Zatwierdzone przypisanie i termin odpowiedzi'], system: 'Shared inbox and CRM', sourceKeys: ['n8nCases', 'openclawOperations'] },
  { slug: 'shift-cover-coordinator', title: ['Shift cover coordinator', 'Zastępstwo znalezione bez grupowego chaosu'], oneLiner: ['Check skills, availability, overtime, and fairness before asking eligible coworkers.', 'Sprawdza umiejętności, dostępność, nadgodziny i równowagę zmian przed kontaktem z uprawnionymi osobami.'], category: 'people', contexts: ['small-business', 'team'], primaryUser: ['Shift manager', 'Osoba układająca grafik'], benefit: ['Open shifts are filled faster with fewer messages to the whole team.', 'Wolne zmiany są obsadzane szybciej i bez pisania do całego zespołu.'], complexity: 3, capabilities: ['tool-use', 'memory', 'multi-step-planning', 'human-approval'], archetype: 'orchestrate-multi-step', industries: ['hospitality', 'retail', 'healthcare'], trigger: ['An employee reports an absence or a shift becomes uncovered.', 'Pracownik zgłasza nieobecność albo zmiana zostaje bez obsady.'], subject: ['shift, required skills, availability, labor rules, overtime, and prior assignments', 'zmianę, wymagane umiejętności, dostępność, prawo pracy, nadgodziny i wcześniejsze przydziały'], decision: ['an eligible ranked cover list and contact order', 'ranking uprawnionych zastępstw i kolejność kontaktu'], output: ['Manager-approved cover request and updated roster', 'Prośba o zastępstwo zatwierdzona przez managera i zaktualizowany grafik'], system: 'Scheduling and messaging', sourceKeys: ['openclawOperations', 'n8nCases'] },
  { slug: 'food-safety-log-exception', title: ['Food safety log exception', 'Brak w dzienniku HACCP wykryty przed kontrolą'], oneLiner: ['Read temperature and cleaning logs, find missing or unsafe entries, and assign the corrective check.', 'Odczytuje dzienniki temperatur i czyszczenia, wykrywa braki lub ryzyko i przypisuje kontrolę naprawczą.'], category: 'legal-compliance', contexts: ['small-business', 'team'], primaryUser: ['Restaurant or food-production manager', 'Manager restauracji lub produkcji żywności'], benefit: ['Safety exceptions are addressed during the shift, not discovered days later.', 'Wyjątki bezpieczeństwa są obsługiwane podczas zmiany, a nie kilka dni później.'], complexity: 3, capabilities: ['vision', 'document-understanding', 'scheduled-monitoring', 'tool-use', 'human-approval'], archetype: 'monitor-and-alert', industries: ['hospitality', 'food production'], trigger: ['A required log is submitted, missed, or crosses a safety threshold.', 'Wymagany wpis zostaje dodany, pominięty lub przekracza próg bezpieczeństwa.'], subject: ['temperature logs, cleaning checks, shift, equipment, thresholds, and corrective policy', 'dzienniki temperatur, kontrole czyszczenia, zmianę, sprzęt, progi i politykę naprawczą'], decision: ['a cited exception and the required corrective check', 'udokumentowany wyjątek i wymaganą kontrolę naprawczą'], output: ['Manager-approved corrective task and evidence', 'Zadanie naprawcze zatwierdzone przez managera wraz z dowodem'], system: 'Forms and task manager', sourceKeys: ['n8nCases', 'openaiAgentsTools'] },
  { slug: 'property-maintenance-request-triage', title: ['Property maintenance request triage', 'Awaria najemcy od razu trafia do właściwego fachowca'], oneLiner: ['Read the message and photos, assess urgency, check responsibility, and prepare the right dispatch.', 'Czyta wiadomość i zdjęcia, ocenia pilność, sprawdza odpowiedzialność i przygotowuje właściwe zlecenie.'], category: 'operations', contexts: ['small-business', 'team'], primaryUser: ['Property manager', 'Zarządca nieruchomości'], benefit: ['Urgent repairs move faster and routine issues arrive with complete context.', 'Pilne naprawy ruszają szybciej, a zwykłe zgłoszenia mają pełny kontekst.'], complexity: 3, capabilities: ['vision', 'tool-use', 'memory', 'human-approval'], archetype: 'enrich-and-route', industries: ['property management', 'real estate'], trigger: ['A tenant submits a maintenance request.', 'Najemca wysyła zgłoszenie naprawy.'], subject: ['tenant message, photos, property, lease responsibility, vendor skills, and urgency rules', 'wiadomość najemcy, zdjęcia, lokal, odpowiedzialność z umowy, kompetencje wykonawców i zasady pilności'], decision: ['priority, responsible party, and qualified vendor route', 'priorytet, stronę odpowiedzialną i routing do właściwego wykonawcy'], output: ['Approved work order with complete evidence', 'Zatwierdzone zlecenie z kompletem dowodów'], system: 'Property manager and vendor directory', sourceKeys: ['openaiAgentsTools', 'n8nCases'] },
  { slug: 'construction-change-order-record', title: ['Construction change order record', 'Zmiana na budowie udokumentowana przed dodatkową pracą'], oneLiner: ['Collect messages, photos, drawings, cost, and schedule impact into a review-ready change order.', 'Zbiera wiadomości, zdjęcia, rysunki, koszt i wpływ na termin w zmianę gotową do akceptacji.'], category: 'operations', contexts: ['small-business', 'team'], primaryUser: ['Contractor or project manager', 'Wykonawca lub kierownik projektu'], benefit: ['Extra work has evidence, price, and approval before crews proceed.', 'Dodatkowa praca ma dowody, cenę i akceptację przed rozpoczęciem.'], complexity: 3, capabilities: ['vision', 'document-understanding', 'tool-use', 'human-approval'], archetype: 'draft-and-approve', industries: ['construction'], trigger: ['A field condition or client request changes the approved scope.', 'Warunki na budowie lub prośba klienta zmieniają zatwierdzony zakres.'], subject: ['contract scope, request, site photos, drawings, estimate, schedule, and approvals', 'zakres umowy, prośbę, zdjęcia, rysunki, wycenę, harmonogram i akceptacje'], decision: ['a cited change description, cost, schedule impact, and approval path', 'opis zmiany z dowodami, koszt, wpływ na termin i ścieżkę akceptacji'], output: ['Client-approved change order package', 'Pakiet zmiany zatwierdzony przez klienta'], system: 'Project tracker and document signing', sourceKeys: ['n8nBordr', 'openaiAgentsTools'] },
  { slug: 'business-license-renewal-watch', title: ['Business license renewal watch', 'Licencje i pozwolenia odnowione przed terminem'], oneLiner: ['Track every permit, filing, certificate, and renewal dependency across locations.', 'Pilnuje każdego pozwolenia, zgłoszenia, certyfikatu i zależności odnowienia w wielu lokalizacjach.'], category: 'legal-compliance', contexts: ['small-business', 'team'], primaryUser: ['Small-business owner or operations manager', 'Właściciel małej firmy lub manager operacji'], benefit: ['The business avoids preventable lapses and rushed filings.', 'Firma unika przeoczonych terminów i składania dokumentów na ostatnią chwilę.'], complexity: 3, capabilities: ['document-understanding', 'web-research', 'memory', 'scheduled-monitoring', 'human-approval'], archetype: 'monitor-and-alert', industries: ['hospitality', 'healthcare', 'construction', 'local services'], trigger: ['A permit is added or enters its renewal preparation window.', 'Pozwolenie zostaje dodane albo wchodzi w okres przygotowania do odnowienia.'], subject: ['permit, location, authority, expiry, required evidence, fees, and official rules', 'pozwolenie, lokalizację, urząd, datę ważności, wymagane dowody, opłaty i oficjalne zasady'], decision: ['a dated renewal checklist with official source links', 'checklistę odnowienia z terminami i linkami do oficjalnych źródeł'], output: ['Owner-approved renewal plan', 'Plan odnowienia zatwierdzony przez właściciela'], system: 'Files, web, and calendar', sourceKeys: ['openaiAgentsTools', 'openclawCommunity'] },
  { slug: 'release-readiness-gate', title: ['Release readiness gate', 'Release zatrzymany, zanim brakujący krok trafi na produkcję'], oneLiner: ['Check tests, migrations, flags, approvals, rollback, and monitoring against the release plan.', 'Sprawdza testy, migracje, flagi, akceptacje, rollback i monitoring względem planu wydania.'], category: 'security-it', contexts: ['team', 'small-business'], primaryUser: ['Small software team', 'Mały zespół tworzący oprogramowanie'], benefit: ['Known release gaps surface before deployment.', 'Znane braki wydania wychodzą na jaw przed wdrożeniem.'], complexity: 3, capabilities: ['tool-use', 'document-understanding', 'multi-step-planning', 'human-approval'], archetype: 'investigate-and-report', industries: ['software'], trigger: ['A release candidate is marked ready for production review.', 'Kandydat do wydania zostaje oznaczony jako gotowy do przeglądu produkcyjnego.'], subject: ['release plan, pull requests, tests, migrations, flags, runbook, and monitoring', 'plan wydania, pull requesty, testy, migracje, flagi, runbook i monitoring'], decision: ['go, fix, or explicit-risk acceptance with evidence', 'decyzję wdrażaj, popraw lub zaakceptuj ryzyko wraz z dowodami'], output: ['Tech-lead-approved release decision', 'Decyzja o wydaniu zatwierdzona przez tech leada'], system: 'GitHub and deployment platform', sourceKeys: ['openaiAgentsTools', 'langfuseEvaluation'] },
  { slug: 'dependency-vulnerability-patch', title: ['Dependency vulnerability patch', 'Podatna biblioteka z poprawką gotową do przeglądu'], oneLiner: ['Confirm exposure, choose the smallest safe upgrade, update the lockfile, and run focused tests.', 'Potwierdza ekspozycję, wybiera najmniejszy bezpieczny upgrade, aktualizuje lockfile i uruchamia celowane testy.'], category: 'security-it', contexts: ['team', 'small-business'], primaryUser: ['Software maintainer', 'Osoba utrzymująca oprogramowanie'], benefit: ['Real dependency risks reach review with evidence and a tested patch.', 'Rzeczywiste ryzyko zależności trafia do przeglądu wraz z dowodami i przetestowaną poprawką.'], complexity: 4, capabilities: ['web-research', 'tool-use', 'multi-step-planning', 'human-approval'], archetype: 'draft-and-approve', industries: ['software'], trigger: ['A dependency alert affects a package used by the repository.', 'Alert zależności dotyczy pakietu używanego w repozytorium.'], subject: ['advisory, dependency graph, runtime usage, changelog, code, and tests', 'advisory, graf zależności, użycie runtime, changelog, kod i testy'], decision: ['a minimal patch, residual risk, and review evidence', 'minimalną poprawkę, ryzyko pozostałe i dowody do review'], output: ['Tested dependency-upgrade pull request', 'Przetestowany pull request aktualizujący zależność'], system: 'GitHub and package registry', sourceKeys: ['openaiAgentsTools', 'langfuseEvaluation'] },
  { slug: 'flaky-test-investigation', title: ['Flaky test investigation', 'Niestabilny test z konkretną przyczyną, nie kolejnym rerunem'], oneLiner: ['Collect failed runs, cluster symptoms, reproduce the race, and prepare the smallest verified fix.', 'Zbiera nieudane uruchomienia, grupuje objawy, odtwarza race condition i przygotowuje najmniejszą sprawdzoną poprawkę.'], category: 'security-it', contexts: ['team', 'small-business'], primaryUser: ['Software engineer', 'Inżynier oprogramowania'], benefit: ['Intermittent CI failures become actionable instead of being retried indefinitely.', 'Losowe awarie CI stają się naprawialne zamiast kończyć się kolejnym rerunem.'], complexity: 4, capabilities: ['tool-use', 'memory', 'multi-step-planning', 'human-approval'], archetype: 'investigate-and-report', industries: ['software'], trigger: ['A test alternates between pass and fail across comparable CI runs.', 'Test naprzemiennie przechodzi i pada w porównywalnych uruchomieniach CI.'], subject: ['CI logs, timings, seeds, environment, test code, and recent changes', 'logi CI, timingi, seedy, środowisko, kod testu i ostatnie zmiany'], decision: ['a reproduced cause, confidence, and minimal repair', 'odtworzoną przyczynę, poziom pewności i minimalną naprawę'], output: ['Engineer-reviewed flaky-test fix', 'Poprawka niestabilnego testu po review inżyniera'], system: 'CI and repository', sourceKeys: ['openaiAgentsTools', 'langfuseEvaluation'] },
  { slug: 'product-feedback-weekly-digest', title: ['Product feedback weekly digest', 'Tydzień głosu klientów w jednym raporcie ze źródłami'], oneLiner: ['Group support tickets, issues, and transcripts into recurring product needs and evidence.', 'Grupuje tickety, issue i transkrypcje w powtarzające się potrzeby produktowe wraz z dowodami.'], category: 'research', contexts: ['team', 'small-business'], primaryUser: ['Product manager', 'Product manager'], benefit: ['The team sees repeated customer pain without reading every conversation.', 'Zespół widzi powtarzalne problemy klientów bez czytania każdej rozmowy.'], complexity: 3, capabilities: ['transcription', 'document-understanding', 'multi-agent', 'memory', 'human-approval'], archetype: 'investigate-and-report', industries: ['software'], trigger: ['The scheduled weekly product-feedback review starts.', 'Zaczyna się zaplanowany cotygodniowy przegląd feedbacku.'], subject: ['support tickets, GitHub issues, sales notes, transcripts, and previous themes', 'tickety supportu, issue GitHuba, notatki sprzedażowe, transkrypcje i wcześniejsze tematy'], decision: ['ranked themes, examples, changed volume, and open questions', 'ranking tematów, przykłady, zmianę wolumenu i otwarte pytania'], output: ['Cited product feedback digest', 'Przegląd feedbacku produktowego ze źródłami'], system: 'Support, GitHub, and meeting archive', sourceKeys: ['langfuseDigest'] },
  { slug: 'agent-evaluation-regression-loop', title: ['Agent evaluation regression loop', 'Regresja agenta wykryta przed wdrożeniem'], oneLiner: ['Turn failed production traces and human feedback into a dataset, experiment, and release check.', 'Zamienia nieudane trace’y produkcyjne i feedback ludzi w dataset, eksperyment i kontrolę wydania.'], category: 'security-it', contexts: ['team', 'small-business', 'enterprise'], primaryUser: ['AI product or engineering team', 'Zespół produktu AI lub engineeringu'], benefit: ['Agent changes are measured against real failures before release.', 'Zmiany agenta są mierzone na rzeczywistych błędach przed wydaniem.'], complexity: 4, capabilities: ['tool-use', 'memory', 'multi-agent', 'multi-step-planning', 'human-approval'], archetype: 'orchestrate-multi-step', industries: ['software', 'AI products'], trigger: ['A reviewed production failure is labeled for evaluation.', 'Sprawdzony błąd produkcyjny zostaje oznaczony do ewaluacji.'], subject: ['production trace, human feedback, expected behavior, dataset, prompt, model, and metrics', 'trace produkcyjny, feedback człowieka, oczekiwane zachowanie, dataset, prompt, model i metryki'], decision: ['a reproducible test case, experiment result, and release recommendation', 'odtwarzalny test case, wynik eksperymentu i rekomendację wydania'], output: ['Approved regression test and experiment report', 'Zatwierdzony test regresji i raport eksperymentu'], system: 'Langfuse and CI', sourceKeys: ['langfuseEvaluation'] },
  { slug: 'cloud-cost-anomaly-watch', title: ['Cloud cost anomaly watch', 'Skok kosztów chmury wyjaśniony tego samego dnia'], oneLiner: ['Compare spend with usage, deploys, ownership, and expected seasonality before alerting the team.', 'Porównuje koszt z użyciem, deployami, ownershipem i sezonowością przed wysłaniem alertu.'], category: 'finance', contexts: ['team', 'small-business'], primaryUser: ['Tech lead or cloud owner', 'Tech lead lub owner chmury'], benefit: ['Material cost drift is caught before the monthly invoice.', 'Istotny wzrost kosztów jest wykrywany przed miesięczną fakturą.'], complexity: 3, capabilities: ['tool-use', 'memory', 'scheduled-monitoring', 'human-approval'], archetype: 'monitor-and-alert', industries: ['software'], trigger: ['A service or account crosses its calibrated cost threshold.', 'Usługa lub konto przekracza skalibrowany próg kosztu.'], subject: ['billing export, usage, deploys, tags, owners, commitments, and prior baseline', 'eksport billingowy, użycie, deploye, tagi, ownerów, zobowiązania i wcześniejszy poziom'], decision: ['a cause-ranked anomaly, accountable owner, and reversible next action', 'uszeregowaną przyczynowo anomalię, ownera i odwracalne kolejne działanie'], output: ['Reviewed cloud-cost alert and task', 'Sprawdzony alert kosztowy i zadanie'], system: 'Cloud billing and deployment history', sourceKeys: ['openclawOperations', 'openaiAgentsTools'] },
  { slug: 'data-pipeline-freshness-incident', title: ['Data pipeline freshness incident', 'Nieaktualne dane zatrzymane, zanim trafią do raportu'], oneLiner: ['Trace stale data through upstream jobs, owners, schemas, and recent changes, then prepare recovery.', 'Śledzi nieaktualne dane przez joby upstream, ownerów, schematy i ostatnie zmiany, a potem przygotowuje recovery.'], category: 'security-it', contexts: ['team', 'small-business'], primaryUser: ['Data engineer or analytics owner', 'Data engineer lub owner analityki'], benefit: ['Broken freshness becomes an owned incident with evidence and a safe repair path.', 'Problem ze świeżością danych staje się przypisanym incydentem z dowodami i bezpieczną ścieżką naprawy.'], complexity: 4, capabilities: ['tool-use', 'memory', 'multi-step-planning', 'multi-agent', 'human-approval'], archetype: 'investigate-and-report', industries: ['software', 'analytics'], trigger: ['A dataset misses its freshness SLA or fails a quality check.', 'Dataset nie spełnia SLA świeżości albo nie przechodzi kontroli jakości.'], subject: ['freshness alert, lineage, job logs, schema changes, deploys, and ownership', 'alert świeżości, lineage, logi jobów, zmiany schematu, deploye i ownership'], decision: ['the first broken dependency, affected consumers, and reversible recovery plan', 'pierwszą uszkodzoną zależność, dotkniętych odbiorców i odwracalny plan recovery'], output: ['Engineer-approved recovery and consumer notice', 'Recovery zatwierdzone przez inżyniera i komunikat do odbiorców'], system: 'Data orchestrator and warehouse', sourceKeys: ['openaiAgentsTools', 'openclawOperations'] },
])

const polishOverrides: Record<string, { title: string; oneLiner: string }> = {
  'website-intent-to-qualified-crm-lead': { title: 'Gorący lead ze strony trafia do właściwego handlowca', oneLiner: 'Wykrywa sygnały zakupu, uzupełnia dane firmy i przekazuje wartościowy kontakt odpowiedniej osobie.' },
  'event-attendee-concierge': { title: 'Uczestnik wydarzenia dostaje odpowiedź i pomoc od ręki', oneLiner: 'Odpowiada na pytania z programu wydarzenia i po akceptacji zmienia dane rejestracji.' },
  'multi-brand-voice-support': { title: 'Spójna obsługa klienta dla każdej marki', oneLiner: 'Rozwiązuje typowe sprawy zgodnie z zasadami i stylem komunikacji właściwej marki.' },
  'multi-expert-ecommerce-support': { title: 'Jedna kompletna odpowiedź na złożone pytanie klienta', oneLiner: 'Łączy informacje o zamówieniu, produkcie, zwrotach i lojalności, żeby klient nie był odsyłany między działami.' },
  'specialist-support-swarm': { title: 'Trudna sprawa klienta z pełnym kontekstem dla specjalisty', oneLiner: 'Zbiera historię, dane techniczne i rozliczenia, zanim złożona sprawa trafi do seniora.' },
  'travel-cancellation-and-rebooking': { title: 'Odwołana podróż z gotowymi opcjami zmiany', oneLiner: 'Sprawdza zgodne z taryfą alternatywy i wykonuje wyłącznie zmianę zaakceptowaną przez podróżnego.' },
  'it-hr-case-resolution': { title: 'Sprawy pracowników rozwiązane bez krążenia między IT i HR', oneLiner: 'Sprawdza tożsamość, polityki i uprawnienia, a następnie rozwiązuje sprawę lub kieruje ją do właściwego specjalisty.' },
  'brief-to-cms-campaign': { title: 'Gotowa kampania w CMS z jednego briefu', oneLiner: 'Zamienia zatwierdzony brief w materiały dla kanałów i zapisuje je w stagingu do przeglądu.' },
  'transcript-to-content-campaign': { title: 'Webinar lub podcast zamieniony w gotową kampanię', oneLiner: 'Wybiera potwierdzone fragmenty transkryptu i tworzy z nich spójny pakiet treści dla kilku kanałów.' },
  'accessibility-seo-remediation': { title: 'Strony poprawione pod dostępność i SEO', oneLiner: 'Wykrywa problemy na zmienionych stronach i przygotowuje konkretne poprawki w CMS lub kodzie.' },
  'brand-compliance-review': { title: 'Materiały zgodne z marką przed publikacją', oneLiner: 'Sprawdza treść, obietnice i warstwę wizualną względem aktualnych zasad marki.' },
  'campaign-performance-exception-monitor': { title: 'Problemy kampanii wykryte, zanim przepalą budżet', oneLiner: 'Śledzi ustalone KPI, wyjaśnia istotne anomalie i proponuje odwracalne zmiany do akceptacji.' },
  'contract-to-finance-data': { title: 'Dane z umowy gotowe do rozliczenia', oneLiner: 'Wyciąga warunki płatności i rozpoznania przychodu wraz z cytatami, żeby finanse tylko je zweryfikowały.' },
  'procurement-intake-orchestration': { title: 'Wniosek zakupowy od razu trafia właściwą ścieżką', oneLiner: 'Sprawdza kompletność wniosku, zbiera braki i kieruje go do wymaganych akceptacji.' },
  'invoice-processing-and-exception-routing': { title: 'Faktury gotowe do księgowania, wyjątki od razu przypisane', oneLiner: 'Odczytuje fakturę, dopasowuje zamówienie i odbiór, a do księgowości kieruje tylko prawdziwe wyjątki.' },
  'order-price-discrepancy-resolution': { title: 'Rozbieżność ceny faktury wyjaśniona przed płatnością', oneLiner: 'Porównuje umowę, zamówienie, odbiór i fakturę, żeby wskazać źródło różnicy i dozwolone rozwiązanie.' },
  'bank-reconciliation-preparation': { title: 'Uzgodnienie bankowe gotowe do przeglądu', oneLiner: 'Dopasowuje transakcje bankowe do księgi i pokazuje wyłącznie niewyjaśnione różnice.' },
  'close-exception-monitor': { title: 'Blokery zamknięcia miesiąca wykryte na czas', oneLiner: 'Pilnuje zależności i terminów zamknięcia, a istotne opóźnienia przypisuje właściwym osobom.' },
  'variance-reporting-with-evidence': { title: 'Odchylenia budżetowe wyjaśnione wraz ze źródłami', oneLiner: 'Łączy dane finansowe i operacyjne w rzeczowe wyjaśnienie różnic między planem a wykonaniem.' },
  'payment-exception-resolution': { title: 'Nieudana płatność z jasną przyczyną i następnym krokiem', oneLiner: 'Bada wstrzymaną lub odrzuconą płatność i proponuje zgodną z zasadami ponowną próbę, zwrot, wstrzymanie albo eskalację.' },
  'investor-relations-preparation': { title: 'Materiały dla inwestorów z gotowymi odpowiedziami na trudne pytania', oneLiner: 'Składa zatwierdzone wyniki, wcześniejsze pytania i kontekst rynkowy w pakiet do przeglądu przez zespół relacji inwestorskich.' },
  'candidate-screening-and-scheduling': { title: 'Najlepiej dopasowani kandydaci szybciej trafiają na rozmowę', oneLiner: 'Stosuje zatwierdzone kryteria, pokazuje dowody i umawia tylko osoby zaakceptowane przez rekrutera.' },
  'frontline-hiring-orchestration': { title: 'Rekrutacja pracowników pierwszej linii bez ręcznego pilnowania etapów', oneLiner: 'Koordynuje kwalifikację, wiadomości, terminy rozmów i dokumenty w rekrutacji masowej.' },
  'promotion-change-workflow': { title: 'Awans lub zmiana warunków przechodzi kompletną kontrolę', oneLiner: 'Sprawdza politykę, budżet, widełki i wymagane zgody przed zapisaniem zmiany pracowniczej.' },
  'employee-policy-case-triage': { title: 'Pracownik szybciej dostaje właściwą odpowiedź lub pomoc HR', oneLiner: 'Odpowiada na podstawie aktualnej polityki, a poufne lub niejasne sprawy kieruje do specjalisty.' },
  'legal-playbook-review': { title: 'Umowa sprawdzona według firmowych zasad negocjacji', oneLiner: 'Porównuje zapisy z firmowymi zasadami i przygotowuje proponowane zmiany do przeglądu prawnika.' },
  'litigation-evidence-chronology': { title: 'Chronologia sporu z linkiem do każdego dowodu', oneLiner: 'Układa zdarzenia z materiałów sprawy, oznacza sprzeczności i nie wyciąga za prawnika wniosków prawnych.' },
  'grc-remediation-planning': { title: 'Ustalenie z kontroli zamienione w plan naprawczy', oneLiner: 'Łączy wykryty problem z konfiguracją systemu i przygotowuje konkretne kroki wraz z testem potwierdzającym naprawę.' },
  'audit-evidence-collection': { title: 'Komplet dowodów audytowych bez ręcznego pościgu', oneLiner: 'Prosi odpowiedzialne osoby o właściwe materiały, sprawdza ich kompletność i zachowuje pochodzenie każdego dowodu.' },
  'regulatory-change-impact-assessment': { title: 'Zmiana regulacji przełożona na konkretne zadania', oneLiner: 'Mapuje zatwierdzoną interpretację na polityki, kontrole, systemy i odpowiedzialne osoby.' },
  'insurance-claims-intake': { title: 'Kompletne zgłoszenie szkody od razu trafia do właściwej osoby', oneLiner: 'Wyciąga fakty i załączniki, sprawdza braki oraz ocenia pilność bez podejmowania decyzji o pokryciu.' },
  'insurance-claim-orchestration': { title: 'Sprawa szkody przechodzi kolejne etapy bez zgubionych zadań', oneLiner: 'Koordynuje dokumenty, wykonawców, rezerwy i komunikację wokół decyzji likwidatora.' },
  'underwriting-research-pack': { title: 'Pełny obraz ryzyka dla osoby oceniającej polisę', oneLiner: 'Zbiera ekspozycje, historię szkód i dane zewnętrzne w pakiet z pytaniami wymagającymi decyzji.' },
  'title-escrow-transaction-review': { title: 'Błędy w dokumentach zamknięcia wykryte przed transakcją', oneLiner: 'Przegląda e-maile i dokumenty, wykrywa niespójności i proponuje dozwolone korekty do zatwierdzenia.' },
  'soc-alert-triage': { title: 'Najważniejsze alerty bezpieczeństwa z pełnym kontekstem', oneLiner: 'Uzupełnia alert o dane urządzenia, użytkownika i znanych zagrożeń, a potem proponuje wagę i właściwą ścieżkę reakcji.' },
  'malware-hunt-investigation': { title: 'Ślady złośliwego oprogramowania połączone w plan dochodzenia', oneLiner: 'Koreluje próbki, wskaźniki i telemetrię między urządzeniami oraz przygotowuje konkretne zapytania do dalszego badania.' },
  'natural-language-security-workflow': { title: 'Procedura bezpieczeństwa zamieniona w testowalną automatyzację', oneLiner: 'Zamienia kroki analityka w automatyzację z minimalnymi uprawnieniami i raportem testów przed aktywacją.' },
  'p1-incident-response': { title: 'Incydent P1 z aktualną osią zdarzeń i przypisanymi decyzjami', oneLiner: 'Łączy alerty, logi, wdrożenia i procedury naprawcze, a każdą zmianę produkcyjną zatrzymuje do akceptacji.' },
  'legacy-access-provisioning': { title: 'Dostęp do starego systemu nadany bez omijania kontroli', oneLiner: 'Sprawdza tożsamość, zgodę, konflikt obowiązków i minimalny zakres przed nadaniem dostępu.' },
  'investment-due-diligence-research': { title: 'Sprawdzenie spółki przed inwestycją', oneLiner: 'Zbiera dane o firmie, rynku i ryzyku w notatkę, w której każde ustalenie prowadzi do źródła.' },
  'order-fulfillment-exception': { title: 'Zablokowane zamówienie z konkretnym planem odzyskania', oneLiner: 'Sprawdza zapas, magazyn, przewoźnika i obietnicę klienta, a potem proponuje najmniej dotkliwe rozwiązanie.' },
  'vendor-onboarding-orchestration': { title: 'Nowy dostawca aktywowany po komplecie kontroli', oneLiner: 'Koordynuje dane podatkowe, bankowe, bezpieczeństwo, umowę i zgody przed utworzeniem rekordu dostawcy.' },
  'field-service-dispatch-recovery': { title: 'Zakłócony grafik wizyt ułożony na nowo', oneLiner: 'Uwzględnia umiejętności techników, SLA, części, dojazdy i okna klientów przed propozycją nowego planu.' },
  'inbound-lead-research-and-outreach': { title: 'Nowy kontakt z gotowym rozpoznaniem i pierwszą wiadomością', oneLiner: 'Weryfikuje osobę i firmę, znajduje istotny kontekst i przygotowuje opartą na źródłach wiadomość do akceptacji.' },
  'account-brief-before-sales-call': { title: 'Handlowiec wchodzi na rozmowę z pełnym obrazem konta', oneLiner: 'Łączy historię CRM, użycie produktu i świeże sygnały w krótki brief z pytaniami i ryzykami.' },
  'sales-transcript-to-crm-hygiene': { title: 'Ustalenia z rozmowy zapisane w CRM bez ręcznego przepisywania', oneLiner: 'Wyciąga decyzje, daty, obiekcje i zadania, a pola CRM zmienia dopiero po akceptacji handlowca.' },
  'cpq-quote-preparation': { title: 'Oferta z poprawną ceną i pełną listą wyjątków', oneLiner: 'Sprawdza konfigurację i zasady rabatowe, a każdy wyjątek cenowy kieruje do zespołu zatwierdzającego ofertę.' },
  'renewal-risk-and-next-best-action': { title: 'Ryzyko odnowienia wykryte z wyprzedzeniem', oneLiner: 'Łączy użycie produktu, zgłoszenia, rozliczenia i relację, żeby opiekun klienta dostał uzasadnione działanie do akceptacji.' },
  'release-readiness-gate': { title: 'Wydanie zatrzymane, zanim brakujący krok trafi na produkcję', oneLiner: 'Sprawdza testy, migracje, przełączniki funkcji, akceptacje, plan wycofania i monitoring względem planu wydania.' },
  'flaky-test-investigation': { title: 'Niestabilny test z konkretną przyczyną', oneLiner: 'Zbiera nieudane uruchomienia, grupuje objawy, odtwarza konflikt czasowy i przygotowuje najmniejszą sprawdzoną poprawkę.' },
}

const builtWorkflows = [...blueprints, ...additionalBlueprints, ...expansionBlueprints].map(buildWorkflow)

const unpublishedWorkflowSlugs = new Set([
  'multi-brand-voice-support',
  'specialist-support-swarm',
  'accessibility-seo-remediation',
  'order-price-discrepancy-resolution',
  'close-exception-monitor',
  'investor-relations-preparation',
  'candidate-screening-and-scheduling',
  'frontline-hiring-orchestration',
  'promotion-change-workflow',
  'insurance-claim-orchestration',
  'legacy-access-provisioning',
  'renewal-risk-and-next-best-action',
  'household-bill-due-monitor',
  'subscription-renewal-watch',
  'personal-document-expiry-watch',
  'family-calendar-conflict-resolver',
  'home-maintenance-planner',
  'personal-spending-anomaly-digest',
  'job-application-progress-tracker',
  'health-visit-preparation-pack',
  'photo-document-archive',
  'trip-price-drop-monitor',
  'loyalty-points-expiry-watch',
  'freelance-overdue-invoice-followup',
  'creator-sponsor-deliverable-tracker',
  'video-footage-clip-finder',
  'master-content-platform-pack',
  'freelance-capacity-risk-watch',
  'portfolio-case-study-builder',
  'customer-review-response',
  'small-business-quote-followup',
  'small-business-stock-reorder-watch',
  'small-team-shared-inbox-routing',
  'food-safety-log-exception',
  'business-license-renewal-watch',
  'release-readiness-gate',
])

const workflowCorrections: Record<string, Pick<AgentWorkflow, 'capabilities' | 'whyAgentic'>> = {
  'event-attendee-concierge': {
    capabilities: ['tool-use', 'multi-step-planning', 'human-approval'],
    whyAgentic: {
      en: 'The agent understands a free-form request, checks it against current event and entitlement data, then chooses an allowed action or escalation.',
      pl: 'Agent rozumie swobodnie opisaną prośbę, sprawdza ją w aktualnych danych wydarzenia i uprawnieniach, a następnie wybiera dozwolone działanie lub eskalację.',
    },
  },
  'multi-brand-voice-support': {
    capabilities: ['tool-use', 'memory', 'human-approval'],
    whyAgentic: {
      en: 'The agent recognizes the customer intent and brand context, applies the right policy, then resolves the case or hands it to a person.',
      pl: 'Agent rozpoznaje zamiar klienta i kontekst marki, stosuje właściwe zasady, a następnie rozwiązuje sprawę lub przekazuje ją człowiekowi.',
    },
  },
  'travel-cancellation-and-rebooking': {
    capabilities: ['browser-actions', 'multi-step-planning', 'tool-use', 'human-approval'],
    whyAgentic: {
      en: 'The agent compares changing availability, fare rules, timing, and traveler preferences, then carries out only the option a person approves.',
      pl: 'Agent porównuje zmieniającą się dostępność, zasady taryfy, terminy i preferencje podróżnego, a następnie wykonuje wyłącznie zaakceptowaną opcję.',
    },
  },
  'legacy-access-provisioning': {
    capabilities: ['document-understanding', 'tool-use', 'human-approval'],
    whyAgentic: {
      en: 'The agent combines identity, approval, segregation-of-duties, and least-privilege rules before preparing a bounded access change.',
      pl: 'Agent łączy dane o tożsamości, zgodzie, konflikcie obowiązków i minimalnych uprawnieniach przed przygotowaniem ograniczonej zmiany dostępu.',
    },
  },
  'field-service-dispatch-recovery': {
    capabilities: ['tool-use', 'multi-step-planning', 'memory', 'human-approval'],
    whyAgentic: {
      en: 'The agent replans a changing schedule across technician skills, parts, travel time, service levels, and customer windows.',
      pl: 'Agent układa zmieniony grafik na nowo, uwzględniając umiejętności techników, części, dojazdy, poziom obsługi i okna klientów.',
    },
  },
  'transcript-to-content-campaign': {
    capabilities: ['document-understanding', 'multi-step-planning', 'human-approval'],
    whyAgentic: {
      en: 'The agent identifies supported claims in an approved transcript, adapts them to each channel, and keeps every draft traceable to the source.',
      pl: 'Agent wybiera potwierdzone tezy z gotowego transkryptu, dopasowuje je do kanałów i zachowuje powiązanie każdej treści ze źródłem.',
    },
  },
  'sales-transcript-to-crm-hygiene': {
    capabilities: ['document-understanding', 'tool-use', 'memory', 'human-approval'],
    whyAgentic: {
      en: 'The agent interprets decisions, objections, dates, and commitments in a ready transcript, then proposes precise CRM changes for approval.',
      pl: 'Agent odczytuje decyzje, obiekcje, daty i zobowiązania z gotowego transkryptu, a następnie proponuje konkretne zmiany w CRM do akceptacji.',
    },
  },
  'brand-compliance-review': {
    capabilities: ['document-understanding', 'vision', 'human-approval'],
    whyAgentic: {
      en: 'The agent compares copy and visual assets with approved claims, tone, and brand rules, then points to the exact elements that need review.',
      pl: 'Agent porównuje treść i materiały wizualne z zatwierdzonymi obietnicami, tonem i zasadami marki, a potem wskazuje elementy wymagające sprawdzenia.',
    },
  },
  'variance-reporting-with-evidence': {
    capabilities: ['document-understanding', 'tool-use', 'human-approval'],
    whyAgentic: {
      en: 'The agent connects financial and operational evidence, weighs competing explanations, and produces a cited variance narrative for review.',
      pl: 'Agent łączy dowody finansowe i operacyjne, porównuje możliwe wyjaśnienia i przygotowuje opis odchyleń ze źródłami do przeglądu.',
    },
  },
  'litigation-evidence-chronology': {
    capabilities: ['document-understanding', 'memory', 'human-approval'],
    whyAgentic: {
      en: 'The agent links events across inconsistent case materials, preserves provenance, and flags contradictions without making legal conclusions.',
      pl: 'Agent łączy zdarzenia z niespójnych materiałów sprawy, zachowuje pochodzenie dowodów i wskazuje sprzeczności bez wyciągania wniosków prawnych.',
    },
  },
  'payment-exception-resolution': {
    capabilities: ['document-understanding', 'tool-use', 'multi-step-planning', 'human-approval'],
    whyAgentic: {
      en: 'The agent combines payment state, policy, prior attempts, and exception evidence to choose a permitted recovery path for approval.',
      pl: 'Agent łączy stan płatności, zasady, wcześniejsze próby i dowody wyjątku, żeby zaproponować dozwoloną ścieżkę rozwiązania do akceptacji.',
    },
  },
}

export const agentWorkflows: AgentWorkflow[] = builtWorkflows
  .filter(({ slug }) => !unpublishedWorkflowSlugs.has(slug))
  .map((workflow) => {
    const override = polishOverrides[workflow.slug]
    const correction = workflowCorrections[workflow.slug]
    const localized = override
      ? {
          ...workflow,
          title: { ...workflow.title, pl: override.title },
          oneLiner: { ...workflow.oneLiner, pl: override.oneLiner },
          summary: {
            ...workflow.summary,
            pl: `${override.oneLiner} ${workflow.summary.pl.slice(workflow.oneLiner.pl.length).trim()}`,
          },
        }
      : workflow

    return correction ? { ...localized, ...correction } : localized
  })
