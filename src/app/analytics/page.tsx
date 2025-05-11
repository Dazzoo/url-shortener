'use client'

import { useState, useEffect } from 'react'
import type { UrlResponse } from '@/schemas'
import { FileBarChart } from 'lucide-react'
import { UrlList } from '@/components/analytics/UrlList'
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview'
import { TopItemsList } from '@/components/analytics/TopItemsList'
import { localStorageUtils } from '@/lib/localStorage'
import { getAnalytics } from '@/web-services/analytics'

interface AnalyticsData {
  urlId: string
  clicks: number
  lastClicked: string | null
  topReferrers: { referrer: string | null; count: number }[]
  topCountries: { country: string | null; count: number }[]
  topDevices: { device: string | null; count: number }[]
}

export default function AnalyticsPage() {
  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load URLs from localStorage
    const savedUrls = localStorageUtils.getRecentUrls()
    if (savedUrls) {
      setUrls(savedUrls)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (selectedUrl) {
      fetchAnalytics(selectedUrl)
    }
  }, [selectedUrl])

  const fetchAnalytics = async (urlId: string) => {
    try {
      setLoading(true)
      const data = await getAnalytics(urlId)
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            URL Analytics
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Track and analyze your shortened URLs performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* URL Selection Sidebar */}
          <div className="lg:col-span-1">
            <UrlList
              urls={urls}
              selectedUrl={selectedUrl}
              onSelectUrl={setSelectedUrl}
            />
          </div>

          {/* Analytics Content */}
          <div className="lg:col-span-3">
            {error ? (
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
            ) : !selectedUrl ? (
              <div className="bg-white rounded-lg shadow-xl p-6 text-center">
                <FileBarChart className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Select a URL</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Choose a URL from the sidebar to view its analytics
                </p>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow-xl p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">Loading analytics...</p>
              </div>
            ) : analytics ? (
              <div className="space-y-6">
                <AnalyticsOverview
                  clicks={analytics.clicks}
                  lastClicked={analytics.lastClicked}
                />

                <TopItemsList
                  title="Top Referrers"
                  items={analytics.topReferrers}
                  itemKey="referrer"
                />

                <TopItemsList
                  title="Top Countries"
                  items={analytics.topCountries}
                  itemKey="country"
                />

                <TopItemsList
                  title="Top Devices"
                  items={analytics.topDevices}
                  itemKey="device"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
} 