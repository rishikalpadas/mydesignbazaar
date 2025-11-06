import { NextResponse } from "next/server"
import { verifyToken } from "../../../../middleware/auth"

export async function GET(request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    host: request.headers.get('host'),
  }

  // Check if auth-token cookie exists
  const authCookie = request.cookies.get('auth-token')
  debugInfo.cookiePresent = !!authCookie
  debugInfo.cookieValue = authCookie ? 'EXISTS (length: ' + authCookie.value.length + ')' : 'MISSING'

  // Test token verification
  if (authCookie) {
    const authResult = await verifyToken(request)
    debugInfo.tokenVerification = {
      success: !authResult.error,
      error: authResult.error || null,
      userFound: !!authResult.user,
      userType: authResult.user?.userType || null,
      userId: authResult.user?._id || null,
      userEmail: authResult.user?.email || null
    }
  } else {
    debugInfo.tokenVerification = {
      success: false,
      error: 'No cookie present',
      userFound: false
    }
  }

  console.log('[AUTH-DEBUG] Authentication debug info:', debugInfo)
  
  return NextResponse.json({
    status: 'Authentication Debug',
    ...debugInfo
  }, { status: 200 })
}