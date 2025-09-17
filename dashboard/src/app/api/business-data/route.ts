import { NextRequest, NextResponse } from 'next/server'

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5001'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Forward the request to Flask backend
    const response = await fetch(`${FLASK_BACKEND_URL}/api/business-data`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch business data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching business data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
