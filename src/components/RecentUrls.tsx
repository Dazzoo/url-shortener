import { useState } from 'react'
import type { UrlResponse } from '@/schemas'
import { QrCode } from 'lucide-react'

interface RecentUrlsProps {
  urls: UrlResponse[]
}

export function RecentUrls({ urls }: RecentUrlsProps) {
  const [showAll, setShowAll] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedUrlId, setExpandedUrlId] = useState<string | null>(null)
  const displayedUrls = showAll ? urls : urls.slice(0, 3)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadQRCode = (qrCode: string, shortCode: string) => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qrcode-${shortCode}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (urls.length === 0) return null

  return (
    <div className="mt-12 bg-white rounded-lg shadow-xl p-6 sm:p-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Recent URLs</h2>
      <div className="space-y-4">
        {displayedUrls.map((url) => (
          <div
            key={url.id}
            className={`flex flex-col p-4 rounded-lg transition-all duration-200 group relative overflow-hidden
              ${copiedId === url.id 
                ? 'bg-green-50 border-2 border-green-400' 
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 border border-gray-200'}`}
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`, url.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {url.longUrl}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <a
                    href={`${window.location.origin}/${url.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {`${window.location.origin}/${url.shortCode}`}
                  </a>
                  <span className={`text-xs transition-colors duration-200 ${
                    copiedId === url.id ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {copiedId === url.id ? '✓ Copied!' : '(click to copy)'}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  copiedId === url.id 
                    ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20' 
                    : 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                }`}>
                  {url.shortCode}
                </span>
                {url.qrCode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedUrlId(expandedUrlId === url.id ? null : url.id)
                    }}
                    className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    title="Show QR Code"
                  >
                    <QrCode className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            {url.qrCode && expandedUrlId === url.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col items-center">
                <img
                  src={url.qrCode}
                  alt="QR Code"
                  className="w-48 h-48 mb-2"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadQRCode(url.qrCode!, url.shortCode)
                  }}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                >
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {urls.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 cursor-pointer w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showAll ? 'Show Less' : `Show ${urls.length - 3} More`}
        </button>
      )}
    </div>
  )
} 