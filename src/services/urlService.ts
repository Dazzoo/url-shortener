import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'
import { Prisma } from '@prisma/client'
import { RedisService } from './redisService'
import { urlResponseSchema, type CreateUrlRequest, UrlResponse } from '@/schemas/url'
import QRCode from 'qrcode'
import { generateQRCode } from '@/lib/qrCode'
import { UAParser } from 'ua-parser-js'
import { GeoService } from './geoService'


export class UrlService {
  static async createUrl(data: CreateUrlRequest) {
    const shortCode = data.customCode || await this.generateShortCode()
    
    // Generate QR code if requested
    let qrCode = null
    if (data.generateQR) {
      const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`
      qrCode = await generateQRCode(fullUrl)
    }

    const url = await prisma.url.create({
      data: {
        shortCode,
        longUrl: data.longUrl,
        title: data.title || null,
        qrCode,
      }
    })
    
    const validatedUrl = urlResponseSchema.parse(url)
    
    // Cache in Redis
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(shortCode), validatedUrl)
    
    return validatedUrl
  }

  static async getUrlByCode(code: string) {
    // Try cache first
    const cached = await RedisService.get(
      RedisService.getShortCodeKey(code),
      urlResponseSchema
    )
    if (cached) {
      return cached
    }

    const url = await prisma.url.findUnique({
      where: { shortCode: code }
    })
    
    if (!url) return null
    
    const validatedUrl = urlResponseSchema.parse(url)
    
    // Cache in Redis
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(code), validatedUrl)
    
    return validatedUrl
  }

  static async getUrlById(id: string) {
    // Try cache first
    const cached = await RedisService.get(
      RedisService.getUrlKey(id),
      urlResponseSchema
    )
    if (cached) {
      return cached
    }

    const url = await prisma.url.findUnique({
      where: { id }
    })
    
    if (!url) return null
    
    const validatedUrl = urlResponseSchema.parse(url)
    
    // Cache in Redis
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(url.shortCode), validatedUrl)
    
    return validatedUrl
  }

  static async updateUrl(id: string, data: Partial<CreateUrlRequest>) {
    // Get existing URL first to access shortCode
    const existingUrl = await prisma.url.findUnique({
      where: { id }
    })
    
    if (!existingUrl) {
      throw new Error('URL not found')
    }

    const url = await prisma.url.update({
      where: { id },
      data: {
        longUrl: data.longUrl,
        title: data.title,
        // Generate new QR code if requested
        qrCode: data.generateQR 
          ? await generateQRCode(`${process.env.NEXT_PUBLIC_APP_URL}/${existingUrl.shortCode}`)
          : undefined
      }
    })
    
    const validatedUrl = urlResponseSchema.parse(url)
    
    // Update cache
    await RedisService.set(RedisService.getUrlKey(url.id), validatedUrl)
    await RedisService.set(RedisService.getShortCodeKey(url.shortCode), validatedUrl)
    
    return validatedUrl
  }

  private static async generateShortCode(): Promise<string> {
    const length = 6
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let shortCode: string
    
    do {
      shortCode = Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    } while (await prisma.url.findUnique({ where: { shortCode } }))
    
    return shortCode
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
    console.log('Recording analytics with IP:', analytics.ipAddress)
    
    const parser = new UAParser(analytics.userAgent)
    const device = parser.getDevice().type || 'desktop'
    const browser = parser.getBrowser().name
    const os = parser.getOS().name

    // Get country asynchronously
    const country = await GeoService.getCountryFromIP(analytics.ipAddress || '')
    console.log('Detected country:', country)

    return prisma.analytics.create({
      data: {
        urlId,
        ...analytics,
        device: `${device}${browser ? ` (${browser})` : ''}${os ? ` - ${os}` : ''}`,
        country
      }
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