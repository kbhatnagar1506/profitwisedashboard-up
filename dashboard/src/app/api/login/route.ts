import { NextRequest, NextResponse } from 'next/server'

const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5001'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the login request to Flask backend
    const response = await fetch(`${FLASK_BACKEND_URL}/user_login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (data.success) {
      // Set cookies for session management
      const response = NextResponse.json(data)
      
      // Forward any cookies from Flask backend
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader)
      }
      
      return response
    } else {
      return NextResponse.json(data, { status: 401 })
    }
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
