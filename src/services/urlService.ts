import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'
import { Prisma } from '@prisma/client'
import redis from '@/lib/redis'

const CACHE_TTL = 60 * 60 // 1 hour in seconds

export class UrlService {
  static async createUrl(longUrl: string, customCode?: string, userId?: string) {
    const shortCode = customCode || nanoid(6)
    
    const data: Prisma.UrlCreateInput = {
      shortCode,
      longUrl,
    }

    // Only add user relation if userId is provided
    if (userId) {
      data.user = {
        connect: { id: userId }
      }
    }
    
    const url = await prisma.url.create({ data })
    
    // Cache the new URL
    await redis.setex(`url:${shortCode}`, CACHE_TTL, JSON.stringify(url))
    
    return url
  }

  static async getUrlByCode(code: string) {
    // Try to get from cache first
    const cachedUrl = await redis.get(`url:${code}`)
    if (cachedUrl) {
      return JSON.parse(cachedUrl)
    }

    // If not in cache, get from database
    const url = await prisma.url.findUnique({
      where: { shortCode: code },
      include: {
        analytics: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    // Cache the result if found
    if (url) {
      await redis.setex(`url:${code}`, CACHE_TTL, JSON.stringify(url))
    }

    return url
  }

  static async incrementClicks(urlId: string) {
    const url = await prisma.url.update({
      where: { id: urlId },
      data: { clicks: { increment: 1 } },
    })

    // Update cache if exists
    const cachedUrl = await redis.get(`url:${url.shortCode}`)
    if (cachedUrl) {
      const updatedUrl = { ...JSON.parse(cachedUrl), clicks: url.clicks }
      await redis.setex(`url:${url.shortCode}`, CACHE_TTL, JSON.stringify(updatedUrl))
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

  static async getAnalytics(urlId: string, userId?: string) {
    const url = await prisma.url.findUnique({
      where: { id: urlId },
      include: {
        analytics: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!url) return null
    if (userId && url.userId !== userId) return null

    return url.analytics
  }

  static async deleteUrl(urlId: string, userId?: string) {
    const url = await prisma.url.findUnique({
      where: { id: urlId }
    })

    if (!url) return null
    if (userId && url.userId !== userId) return null

    // Delete from cache
    await redis.del(`url:${url.shortCode}`)

    return prisma.url.delete({
      where: { id: urlId }
    })
  }
} 