import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'

export class UrlService {
  static async createUrl(longUrl: string, customCode?: string, userId?: string) {
    const shortCode = customCode || nanoid(6)
    
    const data: any = {
      shortCode,
      longUrl,
    }

    // Only add user relation if userId is provided
    if (userId) {
      data.user = {
        connect: { id: userId }
      }
    }
    
    return prisma.url.create({
      data
    })
  }

  static async getUrlByCode(code: string) {
    return prisma.url.findUnique({
      where: { shortCode: code },
    })
  }

  static async incrementClicks(urlId: string) {
    return prisma.url.update({
      where: { id: urlId },
      data: { clicks: { increment: 1 } },
    })
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
    // Only return analytics if the user owns the URL
    const url = await prisma.url.findUnique({
      where: { id: urlId },
      include: { analytics: true },
    })

    if (!url) return null
    if (userId && url.userId !== userId) return null

    return url.analytics
  }
} 