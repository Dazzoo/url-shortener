import { NextRequest, NextResponse } from 'next/server'
import { UrlService } from '@/services/urlService'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code
    const url = await UrlService.getUrlByShortCode(code)

    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      )
    }

    if (!url.isActive) {
      return NextResponse.json(
        { error: 'URL is no longer active' },
        { status: 410 }
      )
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'URL has expired' },
        { status: 410 }
      )
    }

    // Record analytics
    await UrlService.recordAnalytics(url.id, {
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    })

    // Increment click count
    await UrlService.incrementClicks(url.id)

    return NextResponse.redirect(url.longUrl)
  } catch (error) {
    console.error('Error in URL redirect:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 