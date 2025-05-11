import { useState, useEffect } from 'react'
import { createUrl } from '@/web-services/urls/api'
import type { CreateUrlRequest, UrlResponse } from '@/schemas/url'
import { localStorageUtils } from '@/lib/localStorage'

interface UrlFormProps {
  onUrlCreated: (url: UrlResponse) => void
}

export function UrlForm({ onUrlCreated }: UrlFormProps) {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [generateQR, setGenerateQR] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)

  // Load the generateQR state from localStorage
  useEffect(() => {
    const loadGenerateQR = async () => {
      const storedGenerateQR = await localStorageUtils.get<boolean>('generateQR')
      if (storedGenerateQR !== null) {
        setGenerateQR(storedGenerateQR)
      }
    }
    loadGenerateQR()
  }, [])

  // Save the generateQR state to localStorage
  useEffect(() => {
    localStorageUtils.set('generateQR', generateQR)
  }, [generateQR])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setQrCode(null)

    try {
      const data: CreateUrlRequest = {
        longUrl: url,
        customCode: customCode || undefined,
        generateQR,
      }

      const result = await createUrl(data)
      const fullShortUrl = `${window.location.origin}/${result.shortCode}`
      setShortUrl(fullShortUrl)
      setQrCode(result.qrCode)
      onUrlCreated(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create URL')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadQRCode = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderQRCode = (qrCodeData: string) => (
    <div className="mt-4 flex flex-col items-center">
      <img
        src={qrCodeData}
        alt="QR Code"
        className="w-48 h-48 mb-2"
      />
      <button
        onClick={(e) => {
          e.stopPropagation()
          downloadQRCode()
        }}
        className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
      >
        Download QR Code
      </button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Long URL
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="url"
              name="url"
              id="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
              placeholder="https://example.com/very/long/url"
            />
          </div>
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
            Custom Code (optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="customCode"
              id="customCode"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
              placeholder="my-short-url"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <label htmlFor="generateQR" className="text-sm font-medium text-gray-700">
            Generate QR Code
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={generateQR || false}
            onClick={() => setGenerateQR(!generateQR)}
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              generateQR ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                generateQR ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {shortUrl && (
        <div 
          onClick={() => copyToClipboard(shortUrl)}
          className={`mt-6 p-4 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden
            ${isCopied 
              ? 'bg-green-50 border-2 border-green-400' 
              : 'bg-green-50 border-2 border-transparent hover:bg-green-100 border border-green-200'}`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your short URL is ready:</p>
                <div className="mt-2 flex items-center space-x-2">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {shortUrl}
                  </a>
                  <span className={`text-xs transition-colors duration-200 ${
                    isCopied ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {isCopied ? '✓ Copied!' : '(click to copy)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {qrCode && renderQRCode(qrCode)}
        </div>
      )}
    </div>
  )
} 