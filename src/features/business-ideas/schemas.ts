import { z } from 'zod'

const capitalRequiredSchema = z.enum(['none', 'low', 'medium', 'high'])
const difficultySchema = z.enum(['low', 'medium', 'high'])
const timeToRevenueSchema = z.enum(['days', 'weeks', 'months', 'years'])

export const ideaFiltersSchema = z.object({
  industries: z.array(z.string().min(1)).optional(),
  businessModels: z.array(z.string().min(1)).optional(),
  capitalRequired: z.array(capitalRequiredSchema).optional(),
  difficulty: z.array(difficultySchema).optional(),
  timeToRevenue: z.array(timeToRevenueSchema).optional(),
  minSoloFounderFit: z.number().int().min(0).max(10).optional(),
  minAiLeverage: z.number().int().min(0).max(10).optional(),
  minB2bFit: z.number().int().min(0).max(10).optional(),
})

export const userIdeaProfileSchema = z.object({
  query: z.string().optional(),
  whoAreYou: z.string().optional(),
  skills: z.array(z.string()).optional(),
  preferredIndustries: z.array(z.string()).optional(),
  dislikedIndustries: z.array(z.string()).optional(),
  businessPreference: z.enum(['b2b', 'b2c', 'both']).optional(),
  capitalAvailable: capitalRequiredSchema.optional(),
  wantsSoloFounder: z.boolean().optional(),
  wantsAiLeverage: z.boolean().optional(),
  preferredTimeToRevenue: timeToRevenueSchema.optional(),
  notes: z.string().optional(),
})

export const ideaSearchInputSchema = z.object({
  query: z.string().min(1).max(1000),
  filters: ideaFiltersSchema.optional(),
  profile: userIdeaProfileSchema.optional(),
  limit: z.number().int().min(1).max(200).default(10).optional(),
})

export const recommendInputSchema = z.object({
  profile: userIdeaProfileSchema,
  limit: z.number().int().min(1).max(25).default(10).optional(),
})
