import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"

export async function GET() {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET (' + process.env.JWT_SECRET.length + ' chars)' : 'MISSING',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
    timestamp: new Date().toISOString(),
    // Don't expose actual values for security
  }

  console.log('[ENV-CHECK] Environment variables check:', envCheck)
  
  // Test MongoDB connection
  let mongoStatus = 'UNKNOWN';
  try {
    await connectDB();
    mongoStatus = 'CONNECTED';
  } catch (error) {
    mongoStatus = 'FAILED: ' + error.message;
    console.error('[ENV-CHECK] MongoDB connection failed:', error);
  }

  // Test JWT functionality
  let jwtStatus = 'UNKNOWN';
  try {
    if (process.env.JWT_SECRET) {
      const jwt = require('jsonwebtoken');
      const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: '1m' });
      const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
      jwtStatus = decoded.test === 'data' ? 'WORKING' : 'INVALID';
    } else {
      jwtStatus = 'JWT_SECRET_MISSING';
    }
  } catch (error) {
    jwtStatus = 'FAILED: ' + error.message;
  }
  
  return NextResponse.json({
    status: 'Environment Check',
    ...envCheck,
    mongoStatus,
    jwtStatus,
    tests: {
      canCreateJWT: jwtStatus === 'WORKING',
      canConnectMongo: mongoStatus === 'CONNECTED',
      hasRequiredEnvVars: envCheck.JWT_SECRET !== 'MISSING' && envCheck.MONGODB_URI !== 'MISSING'
    }
  }, { status: 200 })
}