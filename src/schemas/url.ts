import { z } from 'zod'

export const urlSchema = z.object({
  longUrl: z.string().url(),
  customCode: z.string()
    .min(3, 'Custom code must be at least 3 characters')
    .max(20, 'Custom code must be less than 20 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Custom code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
  generateQR: z.boolean().optional(),
  title: z.string().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
})

// Schema for raw data from API/database
export const urlResponseRawSchema = z.object({
  id: z.string(),
  shortCode: z.string(),
  longUrl: z.string().url(),
  title: z.string().nullable(),
  clicks: z.number(),
  isActive: z.boolean(),
  expiresAt: z.string().nullable(),
  qrCode: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().nullable(),
})

// Schema for transformed data with proper Date objects
export const urlResponseSchema = z.object({
  id: z.string(),
  shortCode: z.string(),
  longUrl: z.string().url(),
  title: z.string().nullable(),
  clicks: z.number(),
  isActive: z.boolean(),
  expiresAt: z.date().nullable(),
  qrCode: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().nullable(),
})

// Export types derived from schemas
export type CreateUrlRequest = z.infer<typeof urlSchema>
export type UrlResponseRaw = z.infer<typeof urlResponseRawSchema>
export type UrlResponse = z.infer<typeof urlResponseSchema>

// Helper function to transform raw data to proper format
export function transformUrlResponse(raw: UrlResponseRaw): UrlResponse {
  return {
    ...raw,
    expiresAt: raw.expiresAt ? new Date(raw.expiresAt) : null,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  }
} 

