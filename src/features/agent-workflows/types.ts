export type LocalizedText = {
  en: string
  pl: string
}

export type AgentWorkflowCategory =
  | 'personal'
  | 'travel'
  | 'research'
  | 'creator'
  | 'sales'
  | 'customer-support'
  | 'marketing'
  | 'finance'
  | 'people'
  | 'legal-compliance'
  | 'insurance'
  | 'security-it'
  | 'operations'

export type AgentWorkflowArchetype =
  | 'enrich-and-route'
  | 'draft-and-approve'
  | 'investigate-and-report'
  | 'reconcile-and-flag'
  | 'monitor-and-alert'
  | 'orchestrate-multi-step'
  | 'auto-execute-with-guardrails'

export type AgentWorkflowDifficulty = 'low' | 'medium' | 'high'
export type AgentWorkflowMaturity = 'emerging' | 'proven' | 'scaled'
export type AgentWorkflowRiskLevel = 'low' | 'medium' | 'high'
export type CompanySize = 'small' | 'medium' | 'enterprise'
export type WorkflowContext = 'personal' | 'freelance' | 'small-business' | 'team' | 'enterprise'
export type WorkflowCapability =
  | 'web-research'
  | 'browser-actions'
  | 'vision'
  | 'transcription'
  | 'document-understanding'
  | 'tool-use'
  | 'memory'
  | 'scheduled-monitoring'
  | 'multi-step-planning'
  | 'multi-agent'
  | 'human-approval'
export type ImpactEstimateBasis = 'case_study' | 'vendor_report' | 'research' | 'editorial_estimate'
export type ImpactConfidence = 'low' | 'medium' | 'high'

export type AgentWorkflowStep = {
  order: number
  action: LocalizedText
}

export type HumanCheckpoint = {
  afterStep: number
  decision: LocalizedText
}

export type WorkflowTool = {
  name: string
  role: LocalizedText
}

export type WorkflowRisk = {
  risk: LocalizedText
  mitigation: LocalizedText
}

export type WorkflowImpact = {
  min: number
  max: number
  unit: 'percent'
  metric: LocalizedText
  estimateBasis: ImpactEstimateBasis
  confidence: ImpactConfidence
  explanation: LocalizedText
}

export type WorkflowSource = {
  title: string
  publisher: string
  url: string
  claim: LocalizedText
}

export type AgentWorkflow = {
  id: string
  slug: string
  title: LocalizedText
  oneLiner: LocalizedText
  summary: LocalizedText
  category: AgentWorkflowCategory
  department: LocalizedText
  archetype: AgentWorkflowArchetype
  contexts: WorkflowContext[]
  primaryUser: LocalizedText
  benefit: LocalizedText
  complexity: 1 | 2 | 3 | 4 | 5
  capabilities: WorkflowCapability[]
  beforeAgentic: LocalizedText
  whyAgentic: LocalizedText
  industries: string[]
  companySizes: CompanySize[]
  difficulty: AgentWorkflowDifficulty
  maturity: AgentWorkflowMaturity
  riskLevel: AgentWorkflowRiskLevel
  implementationTime: {
    min: number
    max: number
    unit: 'weeks' | 'months'
  }
  trigger: LocalizedText
  inputs: LocalizedText[]
  agentSteps: AgentWorkflowStep[]
  humanCheckpoints: HumanCheckpoint[]
  outputs: LocalizedText[]
  minimumStack: LocalizedText[]
  tools: WorkflowTool[]
  risks: WorkflowRisk[]
  guardrails: LocalizedText[]
  impact: WorkflowImpact
  sources: WorkflowSource[]
  published: boolean
  updatedAt: string
}
