'use client'

import { useState, useEffect } from 'react'
import type { UrlResponse } from '@/schemas'
import { UrlForm } from '@/components/UrlForm'
import { RecentUrls } from '@/components/RecentUrls'
import { FeatureCard } from '@/components/FeatureCard'

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
    const updatedUrls = [url, ...recentUrls.slice(0, 9)] // Keep latest 10
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
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <FeatureCard
              title="Analytics"
              description="Track clicks and engagement with your links"
              icon={
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <FeatureCard
              title="QR Codes"
              description="Generate QR codes for your shortened URLs"
              icon={
<svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 9h6V3H3zm1-5h4v4H4zm1 1h2v2H5zm10 4h6V3h-6zm1-5h4v4h-4zm1 1h2v2h-2zM3 21h6v-6H3zm1-5h4v4H4zm1 1h2v2H5zm15 2h1v2h-2v-3h1zm0-3h1v1h-1zm0-1v1h-1v-1zm-10 2h1v4h-1v-4zm-4-7v2H4v-1H3v-1h3zm4-3h1v1h-1zm3-3v2h-1V3h2v1zm-3 0h1v1h-1zm10 8h1v2h-2v-1h1zm-1-2v1h-2v2h-2v-1h1v-2h3zm-7 4h-1v-1h-1v-1h2v2zm6 2h1v1h-1zm2-5v1h-1v-1zm-9 3v1h-1v-1zm6 5h1v2h-2v-2zm-3 0h1v1h-1v1h-2v-1h1v-1zm0-1v-1h2v1zm0-5h1v3h-1v1h-1v1h-1v-2h-1v-1h3v-1h-1v-1zm-9 0v1H4v-1zm12 4h-1v-1h1zm1-2h-2v-1h2zM8 10h1v1H8v1h1v2H8v-1H7v1H6v-2h1v-2zm3 0V8h3v3h-2v-1h1V9h-1v1zm0-4h1v1h-1zm-1 4h1v1h-1zm3-3V6h1v1z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}