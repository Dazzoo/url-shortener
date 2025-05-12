'use client'

import { useState, useEffect } from 'react'
import type { UrlResponse } from '@/schemas'
import { FileBarChart, Link as LinkIcon } from 'lucide-react'
import { UrlList } from '@/components/analytics/UrlList'
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview'
import { TopItemsList } from '@/components/analytics/TopItemsList'
import { localStorageUtils } from '@/lib/localStorage'
import { getAnalytics } from '@/web-services/analytics'
import Link from 'next/link'
import { AnalyticsContent } from '@/components/analytics/AnalyticsContent'

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

  if (urls.length === 0) {
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

          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <LinkIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No URLs Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't created any shortened URLs yet. Create your first URL to start tracking analytics.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your First URL
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
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
            <AnalyticsContent
              selectedUrl={selectedUrl}
              analytics={analytics}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  )
}