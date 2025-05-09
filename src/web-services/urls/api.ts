import { CreateUrlRequest, UrlResponse, AnalyticsResponse } from '@/schemas'

const API_BASE = '/api'

export async function createUrl(data: CreateUrlRequest): Promise<UrlResponse> {
  const response = await fetch(`${API_BASE}/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create URL')
  }

  return response.json()
}

export async function getUrlByCode(code: string): Promise<UrlResponse> {
  const response = await fetch(`${API_BASE}/urls?code=${code}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch URL')
  }

  return response.json()
}

export async function getUrlAnalytics(urlId: string): Promise<AnalyticsResponse[]> {
  const response = await fetch(`${API_BASE}/urls/${urlId}/analytics`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch analytics')
  }

  return response.json()
}

export async function deleteUrl(urlId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/urls/${urlId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete URL')
  }
} 