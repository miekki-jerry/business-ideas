import type { BusinessIdea } from '@/features/business-ideas/types'

export function ideaToSearchMarkdown(idea: BusinessIdea) {
  return `---
id: ${idea.id}
type: business_idea
primary_industry: ${idea.industries[0] ?? 'unknown'}
primary_business_model: ${idea.businessModels[0] ?? 'unknown'}
capital_required: ${idea.capitalRequired}
difficulty: ${idea.difficulty}
---
# ${idea.title}

One-liner:
${idea.oneLiner}

Summary:
${idea.summary}

Problem:
${idea.problem ?? ''}

Target customer:
${idea.targetCustomer ?? ''}

Solution:
${idea.solution ?? ''}

Business model:
${idea.businessModels.join(', ')}

Distribution:
${idea.distributionChannels.join(', ')}

Why it may work:
${idea.evidence.map((item) => item.reason).filter(Boolean).join(' ')}

Evidence:
${idea.evidence.map((item) => `${item.sourceTitle}${item.urlAtTimestamp ? ` (${item.urlAtTimestamp})` : ''}`).join('\n')}
`
}
