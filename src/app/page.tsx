'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl: url, customCode }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create short URL')
      }

      setShortUrl(`${window.location.origin}/${data.shortCode}`)
      toast.success('URL shortened successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
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
              placeholder="https://example.com"
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
              placeholder="custom-code"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Shorten URL
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <p className="font-medium">Your shortened URL:</p>
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