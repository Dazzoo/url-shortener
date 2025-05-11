import { prisma } from '@/lib/db'
import {
  AnalyticsData,
  AnalyticsItem,
  AnalyticsKey,
  analyticsDataSchema,
  analyticsItemSchema
} from '@/schemas/analytics'
import { RedisService } from './redisService'

type TopItem<T extends AnalyticsKey> = { [K in T]: string | null } & { count: number }

export class AnalyticsService {
  private static countOccurrences(items: AnalyticsItem[], key: AnalyticsKey, defaultValue: string): Record<string, number> {
    return items.reduce((acc, item) => {
      const value = item[key] || defaultValue
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private static sortByCount<T extends { count: number }>(items: T[]): T[] {
    return items.sort((a, b) => b.count - a.count)
  }

  private static createTopItems<T extends AnalyticsKey>(
    counts: Record<string, number>,
    key: T
  ): TopItem<T>[] {
    return Object.entries(counts).map(([value, count]) => ({
      [key]: value,
      count
    } as TopItem<T>))
  }

  private static getTopItems<T extends AnalyticsKey>(
    analytics: AnalyticsItem[],
    key: T,
    defaultValue: string = 'Unknown',
    limit: number = 5
  ): TopItem<T>[] {
    const counts = this.countOccurrences(analytics, key, defaultValue)
    const items = this.createTopItems(counts, key)
    return this.sortByCount(items).slice(0, limit)
  }

  static async getAnalytics(urlId: string): Promise<AnalyticsData | null> {
    // Try to get from cache first
    const cached = await RedisService.get(
      RedisService.getAnalyticsKey(urlId),
      analyticsDataSchema
    )
    if (cached) {
      return cached
    }

    // If not in cache, get from database
    const url = await prisma.url.findUnique({
      where: { id: urlId },
      include: {
        analytics: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!url?.analytics) {
      return null
    }

    const analytics = url.analytics.map(item => analyticsItemSchema.parse(item))

    const data = {
      urlId,
      clicks: analytics.length,
      lastClicked: analytics[0]?.createdAt.toISOString() || null,
      topReferrers: this.getTopItems(analytics, 'referrer', 'Direct'),
      topCountries: this.getTopItems(analytics, 'country'),
      topDevices: this.getTopItems(analytics, 'device')
    }

    const validatedData = analyticsDataSchema.parse(data)

    // Cache the result
    await RedisService.set(RedisService.getAnalyticsKey(urlId), validatedData)

    return validatedData
  }

  static async invalidateAnalytics(urlId: string): Promise<void> {
    await RedisService.del(RedisService.getAnalyticsKey(urlId))
  }
}