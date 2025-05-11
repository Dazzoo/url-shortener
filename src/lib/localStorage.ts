import type { UrlResponse } from '@/schemas/url'

const RECENT_URLS_KEY = 'recentUrls'
const MAX_RECENT_URLS = 30

export const localStorageUtils = {
  getRecentUrls: (): UrlResponse[] => {
    if (typeof window === 'undefined') return []
    try {
      const urls = localStorage.getItem(RECENT_URLS_KEY)
      return urls ? JSON.parse(urls) : []
    } catch (error) {
      console.error('Error reading recent URLs from localStorage:', error)
      return []
    }
  },

  addRecentUrl: (url: UrlResponse): void => {
    if (typeof window === 'undefined') return
    try {
      const urls = localStorageUtils.getRecentUrls()
      const updatedUrls = [url, ...urls.filter(u => u.id !== url.id)].slice(0, MAX_RECENT_URLS)
      localStorage.setItem(RECENT_URLS_KEY, JSON.stringify(updatedUrls))
    } catch (error) {
      console.error('Error adding recent URL to localStorage:', error)
    }
  },

  clearRecentUrls: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(RECENT_URLS_KEY)
    } catch (error) {
      console.error('Error clearing recent URLs from localStorage:', error)
    }
  },

  // Generic methods for any type of data
  get: async <T>(key: string): Promise<T | null> => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  },

  remove: async (key: string): Promise<void> => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }
} 