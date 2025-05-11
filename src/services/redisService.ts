import client from '@/lib/redis'
import { RedisClientType } from 'redis'
import { z } from 'zod'

const CACHE_TTL = 60 * 5 // 5 minutes in seconds

export class RedisService {
  private static redis: RedisClientType

  static initialize() {
    this.redis = client
  }

  static async get<T>(key: string, schema: z.ZodType<T>): Promise<T | null> {
    try {
      const cached = await this.redis.get(key)
      if (!cached) return null

      const parsed = JSON.parse(cached)
      return schema.parse(parsed)
    } catch (error) {
      console.error(`Error getting cache for key ${key}:`, error)
      return null
    }
  }

  static async set<T>(key: string, data: T, ttl: number = CACHE_TTL): Promise<void> {
    try {
      await this.redis.setEx(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error(`Error deleting cache for key ${key}:`, error)
    }
  }

  static async mget<T>(keys: string[], schema: z.ZodType<T>): Promise<(T | null)[]> {
    try {
      const cached = await this.redis.mGet(keys)
      return cached.map(item => {
        if (!item) return null
        try {
          const parsed = JSON.parse(item)
          return schema.parse(parsed)
        } catch {
          return null
        }
      })
    } catch (error) {
      console.error('Error getting multiple cache items:', error)
      return keys.map(() => null)
    }
  }

  static async mset<T>(items: { key: string; value: T; ttl?: number }[]): Promise<void> {
    try {
      const multi = this.redis.multi()
      
      items.forEach(({ key, value, ttl = CACHE_TTL }) => {
        multi.setEx(key, ttl, JSON.stringify(value))
      })

      await multi.exec()
    } catch (error) {
      console.error('Error setting multiple cache items:', error)
    }
  }

  // Helper methods for specific services
  static getUrlKey(urlId: string): string {
    return `url:${urlId}`
  }

  static getAnalyticsKey(urlId: string): string {
    return `analytics:${urlId}`
  }

  static getShortCodeKey(shortCode: string): string {
    return `shortcode:${shortCode}`
  }
}