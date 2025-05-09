import { z } from 'zod'

export const analyticsSchema = z.object({
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
})

export const analyticsResponseSchema = z.object({
  id: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  country: z.string().optional(),
  device: z.string().optional(),
  createdAt: z.date(),
})

// Export types derived from schemas
export type AnalyticsInput = z.infer<typeof analyticsSchema>
export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema> 