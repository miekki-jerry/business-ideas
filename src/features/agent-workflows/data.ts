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
      'Porównuje świeże sygnały ze zdefiniowanym baseline, wycisza słabe alerty i tworzy przypisane zadanie dopiero po przekroczeniu zatwierdzonego progu.',
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

type CompactSpec = {
  slug: string
  title: Pair
  oneLiner: Pair
  category: AgentWorkflowCategory
  department: Pair
  archetype: AgentWorkflowArchetype
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
      ['Create the approved assignment and notify its owner.', 'Tworzy zatwierdzone przypisanie i powiadamia jego ownera.'],
    ],
    risk: ['A wrong identity match can send a case to the wrong owner.', 'Błędne rozpoznanie może skierować sprawę do niewłaściwego ownera.'],
    mitigation: ['Require deterministic identifiers and expose the routing rationale.', 'Wymagaj deterministycznych identyfikatorów i pokazuj uzasadnienie routingu.'],
    guardrails: [
      ['Do not route low-confidence identity matches automatically.', 'Nie kieruj automatycznie dopasowań tożsamości o niskiej pewności.'],
      ['Use an allowlist of destinations and writable fields.', 'Stosuj allowlistę miejsc docelowych i zapisywalnych pól.'],
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
      ['Keep templates, policies, and source timestamps visible to the reviewer.', 'Pokazuj reviewerowi szablony, polityki i czas aktualizacji źródeł.'],
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
    mitigation: ['Show source coverage, conflicts, timestamps, and unanswered questions.', 'Pokazuj pokrycie źródeł, konflikty, timestampy i pytania bez odpowiedzi.'],
    guardrails: [
      ['Label inference separately from observed facts.', 'Oznaczaj wnioski oddzielnie od obserwowanych faktów.'],
      ['Do not close the investigation while required sources are unavailable.', 'Nie zamykaj dochodzenia, gdy wymagane źródła są niedostępne.'],
    ],
  },
  'reconcile-and-flag': {
    steps: [
      ['Normalize records and validate period, currency, and ownership.', 'Normalizuje rekordy i sprawdza okres, walutę oraz ownership.'],
      ['Apply deterministic matching rules before model-assisted classification.', 'Stosuje deterministyczne reguły dopasowania przed klasyfikacją wspieraną modelem.'],
      ['Prepare a result covering {{decision}} and isolate every unresolved difference.', 'Przygotowuje wynik obejmujący {{decision}}; każdą niewyjaśnioną różnicę kieruje do review.'],
      ['Post only approved matches and retain the reconciliation evidence.', 'Zapisuje wyłącznie zatwierdzone dopasowania i zachowuje dowody uzgodnienia.'],
    ],
    risk: ['A plausible but incorrect match can hide a material difference.', 'Wiarygodne, lecz błędne dopasowanie może ukryć istotną różnicę.'],
    mitigation: ['Keep deterministic rules outside the model and require review above materiality thresholds.', 'Trzymaj reguły deterministyczne poza modelem i wymagaj review powyżej progów istotności.'],
    guardrails: [
      ['Never auto-clear unresolved or material differences.', 'Nigdy nie zamykaj automatycznie niewyjaśnionych lub istotnych różnic.'],
      ['Preserve source rows and match rationale in the audit trail.', 'Zachowuj rekordy źródłowe i uzasadnienie dopasowania w śladzie audytowym.'],
    ],
  },
  'monitor-and-alert': {
    steps: [
      ['Refresh the monitored signals and reject stale observations.', 'Odświeża monitorowane sygnały i odrzuca nieaktualne obserwacje.'],
      ['Compare the current state with the approved baseline and suppression rules.', 'Porównuje bieżący stan z zatwierdzonym baseline i regułami wyciszania.'],
      ['Prepare {{decision}} with the threshold breach and supporting evidence.', 'Przygotowuje {{decision}} z przekroczonym progiem i dowodami.'],
      ['Create the approved alert or owned follow-up task.', 'Tworzy zatwierdzony alert lub przypisane zadanie follow-up.'],
    ],
    risk: ['Noisy or stale signals can create alert fatigue and poor decisions.', 'Szum lub nieaktualne sygnały mogą powodować alert fatigue i złe decyzje.'],
    mitigation: ['Calibrate thresholds by segment and track precision before enabling actions.', 'Kalibruj progi per segment i mierz precision przed uruchomieniem akcji.'],
    guardrails: [
      ['Suppress alerts without fresh supporting evidence.', 'Wyciszaj alerty bez świeżych dowodów.'],
      ['Do not turn a risk score into an irreversible action.', 'Nie zamieniaj risk score w nieodwracalną akcję.'],
    ],
  },
  'orchestrate-multi-step': {
    steps: [
      ['Build the dependency graph and verify every connector permission.', 'Buduje graf zależności i sprawdza uprawnienia każdego konektora.'],
      ['Coordinate read-only sub-steps and surface blocked dependencies.', 'Koordynuje podkroki read-only i pokazuje zablokowane zależności.'],
      ['Prepare {{decision}} with state, exceptions, and rollback points.', 'Przygotowuje {{decision}} ze stanem, wyjątkami i punktami rollbacku.'],
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
      ['Prepare {{decision}} with side effects and rollback conditions.', 'Przygotowuje {{decision}} ze skutkami ubocznymi i warunkami rollbacku.'],
      ['Execute the approved action, verify the result, and log the change.', 'Wykonuje zatwierdzoną akcję, weryfikuje wynik i zapisuje zmianę.'],
    ],
    risk: ['An incorrect or over-scoped action can change a material record.', 'Błędna lub zbyt szeroka akcja może zmienić istotny rekord.'],
    mitigation: ['Use least-privilege tools, dry runs, hard limits, and post-action verification.', 'Stosuj narzędzia least-privilege, dry runy, twarde limity i weryfikację po akcji.'],
    guardrails: [
      ['Block execution when identity, evidence, or rollback conditions are incomplete.', 'Blokuj wykonanie przy niepełnej tożsamości, dowodach lub warunkach rollbacku.'],
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
    industries: spec.industries,
    companySizes: spec.riskLevel === 'high' ? ['medium', 'enterprise'] : ['small', 'medium', 'enterprise'],
    difficulty: spec.riskLevel === 'high' ? 'high' : 'medium',
    maturity: spec.maturity,
    riskLevel: spec.riskLevel,
    weeks: spec.riskLevel === 'high' ? [8, 16] : [4, 8],
    trigger: spec.trigger,
    inputs: [
      [`Process context: ${spec.subject[0]}`, `Kontekst procesu: ${spec.subject[1]}`],
      [`Approved policies, ownership, and exception rules`, `Zatwierdzone polityki, ownership i reguły wyjątków`],
    ],
    steps,
    checkpoint: [`The accountable process owner approves ${spec.decision[0]}.`, `Odpowiedzialny owner procesu zatwierdza ${spec.decision[1]}.`],
    outputs: [spec.output, ['Evidence, exceptions, and audit trail', 'Dowody, wyjątki i ślad audytowy']],
    minimumStack: spec.category === 'legal-compliance' || spec.category === 'insurance' ? commonStack.documents : commonStack.operations,
    tools: [
      [spec.system, [`Provides the system of record and bounded write actions.`, `Dostarcza system of record i ograniczone akcje zapisu.`]],
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
        'Ograniczony zakres planistyczny dla wskazanego KPI operacyjnego; zweryfikuj go względem baseline sprzed wdrożenia.',
      ],
    ],
    sourceKeys: spec.sourceKeys,
    }
  })
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

export const agentWorkflows: AgentWorkflow[] = [...blueprints, ...additionalBlueprints].map(buildWorkflow)
