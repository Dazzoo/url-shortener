import { NextResponse } from 'next/server'
import { UrlService } from '@/services/urlService'
import { analyticsSchema } from '@/schemas'

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const url = await UrlService.getUrlByCode(params.code)

    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      )
    }

    // Prepare analytics data
    const analyticsData = {
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || 'unknown',
    }

    // Validate analytics data
    const result = analyticsSchema.safeParse(analyticsData)
    if (result.success) {
      await UrlService.recordAnalytics(url.id, result.data)
    }

    // Increment click count
    await UrlService.incrementClicks(url.id)

    // Redirect to the long URL
    return NextResponse.redirect(url.longUrl)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process URL' },
      { status: 500 }
    )
  }
} 