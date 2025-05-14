import { FileBarChart } from 'lucide-react'
import { AnalyticsSkeleton } from './AnalyticsSkeleton'

interface AnalyticsData {
  urlId: string
  clicks: number
  lastClicked: string | null
  topReferrers: { referrer: string | null; count: number }[]
  topCountries: { country: string | null; count: number }[]
  topDevices: { device: string | null; count: number }[]
}

interface AnalyticsContentProps {
  selectedUrl: string | null
  analytics: AnalyticsData | null
  loading: boolean
  error: string | null
}

export function AnalyticsContent({ selectedUrl, analytics, loading, error }: AnalyticsContentProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
    )
  }

  if (!selectedUrl) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 text-center">
        <FileBarChart className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Select a URL</h3>
        <p className="mt-2 text-sm text-gray-500">
          Choose a URL from the sidebar to view its analytics
        </p>
      </div>
    )
  }

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 text-center">
        <FileBarChart className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No analytics data available</h3>
        <p className="mt-2 text-sm text-gray-500">
          No analytics data available for this URL yet.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overview Card */}
      <div className="md:col-span-2 bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{analytics.clicks}</p>
            <p className="text-sm text-gray-500">Total Clicks</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {analytics.topCountries[0]?.count || 0}
            </p>
            <p className="text-sm text-gray-500">Top Country</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {analytics.topDevices[0]?.count || 0}
            </p>
            <p className="text-sm text-gray-500">Top Device</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {analytics.topReferrers[0]?.count || 0}
            </p>
            <p className="text-sm text-gray-500">Top Referrer</p>
          </div>
        </div>
      </div>

      {/* Top Items Lists */}
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Referrers</h2>
        <div className="space-y-4">
          {analytics.topReferrers.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.referrer || 'Direct'}
                </p>
                <p className="text-xs text-gray-500">Referrer</p>
              </div>
              <div className="text-sm font-medium text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Countries</h2>
        <div className="space-y-4">
          {analytics.topCountries.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-medium">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.country || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">Country</p>
              </div>
              <div className="text-sm font-medium text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Devices</h2>
        <div className="space-y-4">
          {analytics.topDevices.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-medium">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.device || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">Device</p>
              </div>
              <div className="text-sm font-medium text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 