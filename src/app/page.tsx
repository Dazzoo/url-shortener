'use client'

import { useState } from 'react'
import { createUrl, type CreateUrlRequest } from '@/web-services/urls'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data: CreateUrlRequest = {
        longUrl: url,
        customCode: customCode || undefined,
      }

      const result = await createUrl(data)
      setShortUrl(`${window.location.origin}/${result.shortCode}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">URL Shortener</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Enter URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="customCode" className="block text-sm font-medium mb-2">
              Custom Code (optional)
            </label>
            <input
              type="text"
              id="customCode"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="w-full p-2 border rounded"
              pattern="[a-zA-Z0-9-_]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            <p>Your short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </main>
  )
} 