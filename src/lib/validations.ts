import { z } from 'zod'

export const urlSchema = z.object({
  longUrl: z.string().url('Please enter a valid URL'),
  customCode: z.string().optional(),
  generateQR: z.boolean().optional(),
}) 