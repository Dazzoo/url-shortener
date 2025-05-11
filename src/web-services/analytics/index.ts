import { AnalyticsData } from "@/schemas/analytics"

const API_URL = '/api/urls'

export const getAnalytics = async (urlId: string): Promise<AnalyticsData[]> => {
  const response = await fetch(`${API_URL}/${urlId}/analytics`)
  if (!response.ok) {
    throw new Error('Failed to fetch analytics')
  }
  return response.json()
}