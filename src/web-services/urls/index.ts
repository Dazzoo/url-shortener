import { type CreateUrlRequest, type UrlResponse } from '@/schemas/url'

const API_URL = '/api/urls'

export async function createUrl(data: CreateUrlRequest): Promise<UrlResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (response.status === 409) {
    throw new Error('Custom code already exists')
  } 

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create URL')
  }

  return response.json()
}

export async function getUrlByCode(code: string): Promise<UrlResponse> {
  const response = await fetch(`${API_URL}/${code}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get URL')
  }

  return response.json()
}

export async function updateUrl(id: string, data: Partial<CreateUrlRequest>): Promise<UrlResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update URL')
  }

  return response.json()
}

export async function deleteUrl(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete URL')
  }
} 