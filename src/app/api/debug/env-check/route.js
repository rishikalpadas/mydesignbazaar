import { NextResponse } from "next/server"

export async function GET() {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
    timestamp: new Date().toISOString(),
    // Don't expose actual values for security
  }

  console.log('[ENV-CHECK] Environment variables check:', envCheck)
  
  return NextResponse.json({
    status: 'Environment Check',
    ...envCheck
  }, { status: 200 })
}