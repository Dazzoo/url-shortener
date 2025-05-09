import { z } from 'zod'

export const urlSchema = z.object({
  longUrl: z.string().url('Please enter a valid URL'),
  customCode: z.string()
    .min(3, 'Custom code must be at least 3 characters')
    .max(20, 'Custom code must be less than 20 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Custom code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
})

export const urlResponseSchema = z.object({
  id: z.string(),
  shortCode: z.string(),
  longUrl: z.string(),
  title: z.string().optional(),
  clicks: z.number(),
  isActive: z.boolean(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Export types derived from schemas
export type CreateUrlRequest = z.infer<typeof urlSchema>
export type UrlResponse = z.infer<typeof urlResponseSchema> 