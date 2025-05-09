import { prisma } from '@/lib/db'
import { nanoid } from 'nanoid'

export class UrlService {
  static async createUrl(longUrl: string, customCode?: string) {
    const shortCode = customCode || nanoid(6)
    
    return prisma.url.create({
      data: {
        shortCode,
        longUrl,
        userId: 'temp-user-id', // We'll add proper auth later
      },
    })
  }

  static async getUrlByCode(shortCode: string) {
    return prisma.url.findUnique({
      where: { shortCode },
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

  static async incrementClicks(urlId: string) {
    return prisma.url.update({
      where: { id: urlId },
      data: { clicks: { increment: 1 } },
    })
  }
} 