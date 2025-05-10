'use client'

import { useState, useEffect } from 'react'
import type { UrlResponse } from '@/schemas'
import { UrlForm } from '@/components/UrlForm'
import { RecentUrls } from '@/components/RecentUrls'
import { FeatureCard } from '@/components/FeatureCard'
import { QrCode, FileBarChart, Link   } from 'lucide-react'

export default function Home() {
  const [recentUrls, setRecentUrls] = useState<UrlResponse[]>([])

  useEffect(() => {
    // Load recent URLs from localStorage on component mount
    const savedUrls = localStorage.getItem('recentUrls')
    if (savedUrls) {
      setRecentUrls(JSON.parse(savedUrls))
    }
  }, [])

  const handleUrlCreated = (url: UrlResponse) => {
    const updatedUrls = [url, ...recentUrls.slice(0, 29)] // Keep latest 30
    setRecentUrls(updatedUrls)
    localStorage.setItem('recentUrls', JSON.stringify(updatedUrls))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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