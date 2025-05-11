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

export const analyticsKeySchema = z.enum(['referrer', 'country', 'device'])
export type AnalyticsKey = z.infer<typeof analyticsKeySchema>

export const analyticsItemSchema = z.object({
  referrer: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  device: z.string().nullable().optional(),
  createdAt: z.date()
})
export type AnalyticsItem = z.infer<typeof analyticsItemSchema>

const createTopItemSchema = <T extends AnalyticsKey>(key: T) => {
  const schema = z.object({
    [key]: z.string().nullable(),
    count: z.number()
  })
  return schema as unknown as z.ZodType<{ [K in T]: string | null } & { count: number }>
}

export const analyticsDataSchema = z.object({
  urlId: z.string(),
  clicks: z.number(),
  lastClicked: z.string().nullable(),
  topReferrers: z.array(createTopItemSchema('referrer')),
  topCountries: z.array(createTopItemSchema('country')),
  topDevices: z.array(createTopItemSchema('device'))
})
export type AnalyticsData = z.infer<typeof analyticsDataSchema> 