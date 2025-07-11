'use client'

import { FeatureCard } from '@/components/FeatureCard'
import { RecentUrls } from '@/components/RecentUrls'
import { UrlForm } from '@/components/UrlForm'
import { localStorageUtils } from '@/lib/localStorage'
import type { UrlResponse } from '@/schemas/url'
import { FileBarChart, Link, QrCode } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [recentUrls, setRecentUrls] = useState<UrlResponse[]>([])

  useEffect(() => {
    // Load recent URLs from localStorage on component mount
    const loadRecentUrls = async () => {
      const savedUrls = await localStorageUtils.getRecentUrls()
      if (savedUrls) {
        setRecentUrls(savedUrls)
      }
    }
    loadRecentUrls()
  }, [])

  const handleUrlCreated = async (url: UrlResponse) => {
    const updatedUrls = [url, ...recentUrls.slice(0, 29)] // Keep latest 30
    setRecentUrls(updatedUrls)
    localStorageUtils.addRecentUrl(url)
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            URL Shortener
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Create short, memorable links for your long URLs
          </p>
        </div>

        <UrlForm onUrlCreated={handleUrlCreated} />
        <RecentUrls urls={recentUrls} />

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Custom URLs"
              description="Create custom short codes for your URLs"
              icon={
                <Link className="h-12 w-12" />
              }
            />
            <FeatureCard
              title="Analytics"
              description="Track clicks and engagement with your links"
              icon={
                <FileBarChart className="h-12 w-12" />
              }
            />
            <FeatureCard
              title="QR Codes"
              description="Generate QR codes for your shortened URLs"
              icon={
                <QrCode className="h-12 w-12" />
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}