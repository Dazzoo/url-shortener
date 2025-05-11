import { UrlResponse } from '@/schemas'

interface UrlListProps {
  urls: UrlResponse[]
  selectedUrl: string | null
  onSelectUrl: (urlId: string) => void
}

export function UrlList({ urls, selectedUrl, onSelectUrl }: UrlListProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Your URLs</h2>
      <div className="space-y-2">
        {urls.map((url) => (
          <button
            key={url.id}
            onClick={() => onSelectUrl(url.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedUrl === url.id
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <p className="text-sm font-medium truncate">{url.longUrl}</p>
            <p className="text-xs text-gray-500">{url.shortCode}</p>
          </button>
        ))}
      </div>
    </div>
  )
} 