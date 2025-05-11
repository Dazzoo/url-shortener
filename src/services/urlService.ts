import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'
import { Prisma } from '@prisma/client'
import { RedisService } from './redisService'
import { urlResponseSchema } from '@/schemas'
import QRCode from 'qrcode'


export class UrlService {
  static async createUrl(longUrl: string, customCode?: string, userId?: string, generateQR?: boolean): Promise<typeof urlResponseSchema._type> {
    const shortCode = customCode || nanoid(10)
    
    // Generate QR code if requested
    let qrCode = null
    if (generateQR) {
      const fullShortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`
      qrCode = await QRCode.toDataURL(fullShortUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
    }
    
    const data: Prisma.UrlCreateInput = {
      shortCode,
      longUrl,
      qrCode,
    }

    // Only add user relation if userId is provided
    if (userId) {
      data.user = {
        connect: { id: userId }
      }
    }
    
    const url = await prisma.url.create({ data })
    
    const validatedUrl = urlResponseSchema.parse(url)
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(shortCode), validatedUrl)
    
    return validatedUrl
  }

  static async getUrlByShortCode(shortCode: string): Promise<typeof urlResponseSchema._type | null> {
    // Try cache first
    const cached = await RedisService.get(
      RedisService.getShortCodeKey(shortCode),
      urlResponseSchema
    )
    if (cached) {
      return cached
    }

    const url = await prisma.url.findUnique({
      where: { shortCode },
    })

    if (!url) {
      return null
    }

    const validatedUrl = urlResponseSchema.parse(url)
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(shortCode), validatedUrl)

    return validatedUrl
  }

  static async getUrlById(id: string): Promise<typeof urlResponseSchema._type | null> {
    // Try cache first
    const cached = await RedisService.get(
      RedisService.getUrlKey(id),
      urlResponseSchema
    )
    if (cached) {
      return cached
    }

    const url = await prisma.url.findUnique({
      where: { id },
    })

    if (!url) {
      return null
    }

    const validatedUrl = urlResponseSchema.parse(url)
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(url.shortCode), validatedUrl)

    return validatedUrl
  }

  static async incrementClicks(urlId: string) {
    const url = await prisma.url.update({
      where: { id: urlId },
      data: { clicks: { increment: 1 } },
    })

    // Update cache if exists
    const cachedUrl = await RedisService.get(RedisService.getUrlKey(url.id), urlResponseSchema)
    if (cachedUrl) {
      const updatedUrl = { ...cachedUrl, clicks: url.clicks }
      await RedisService.set(RedisService.getUrlKey(url.id), updatedUrl)
    }

    return url
  }

  static async recordAnalytics(urlId: string, analytics: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }) {
    return prisma.analytics.create({
      data: {
        urlId,
        ...analytics,
      },
    })
  }

  static async deleteUrl(id: string): Promise<void> {
    const url = await prisma.url.findUnique({
      where: { id },
    })

    if (url) {
      await prisma.url.delete({
        where: { id },
      })

      // Invalidate cache
      await RedisService.del(RedisService.getUrlKey(id))
      await RedisService.del(RedisService.getShortCodeKey(url.shortCode))
    }
  }
} 