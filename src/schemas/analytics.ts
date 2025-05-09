import { z } from 'zod'

export const analyticsSchema = z.object({
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
})

export type AnalyticsInput = z.infer<typeof analyticsSchema> 