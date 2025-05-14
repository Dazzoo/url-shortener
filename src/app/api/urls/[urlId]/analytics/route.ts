import { AnalyticsService } from '@/services/analyticsService'
import { NextResponse } from 'next/server'


export async function GET(
  request: Request,
  { params }: { params: Promise<{ urlId: string }> }
) {
  try {
    const urlId = (await params).urlId
    const analytics = await AnalyticsService.getAnalytics(urlId)

    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 