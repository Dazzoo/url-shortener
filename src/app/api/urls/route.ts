import { NextResponse } from 'next/server'
import { UrlService } from '@/services/urlService'
import { urlSchema } from '@/schemas'
import { Prisma } from '@prisma/client'

// POST route to create a new URL
export async function POST(req: Request) {
  const body = await req.json()
    
  // Validate input
  const result = urlSchema.safeParse(body)
  try {
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      )
    }

    const { longUrl, customCode, generateQR } = result.data
    const url = await UrlService.createUrl({ longUrl, customCode, generateQR })
    return NextResponse.json(url)
  } catch (error) {
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: `Custom code ${result?.data?.customCode} already exists, please try a different one.` },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create URL' },
      { status: 500 }
    )
  }
}

// GET route to fetch URL by short code
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const shortCode = searchParams.get('code')

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      )
    }

    const url = await UrlService.getUrlByCode(shortCode)

    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(url)
  } catch (error) {
    console.error('Error fetching URL:', error)
    return NextResponse.json(
      { error: 'Failed to fetch URL' },
      { status: 500 }
    )
  }
} 