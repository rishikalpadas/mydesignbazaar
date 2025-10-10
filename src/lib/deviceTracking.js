/**
 * Device Tracking Utilities for Copyright Management
 * Captures IP address and device information during design uploads
 * Note: MAC addresses cannot be obtained from browsers for security/privacy reasons
 */

/**
 * Extracts IP address from request headers
 * Checks various headers that proxies and load balancers might use
 */
export function getClientIP(request) {
  // Check for forwarded IP from proxies/load balancers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take the first IP if multiple are present
    return forwarded.split(',')[0].trim();
  }

  // Check for real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Check for Cloudflare connecting IP
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP.trim();
  }

  // Fallback to remote address (may not work in all environments)
  return request.headers.get('x-client-ip') || 'Unknown';
}

/**
 * Parses User-Agent string to extract device information
 */
export function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      platform: 'Unknown'
    };
  }

  // Detect Browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  let os = 'Unknown';
  if (userAgent.includes('Windows NT 10.0')) {
    os = 'Windows 10/11';
  } else if (userAgent.includes('Windows NT 6.3')) {
    os = 'Windows 8.1';
  } else if (userAgent.includes('Windows NT 6.2')) {
    os = 'Windows 8';
  } else if (userAgent.includes('Windows NT 6.1')) {
    os = 'Windows 7';
  } else if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X ([\d_]+)/);
    os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS')) {
    os = 'iOS';
  }

  // Detect Platform
  let platform = 'Unknown';
  if (userAgent.includes('Win64') || userAgent.includes('x64')) {
    platform = 'Windows 64-bit';
  } else if (userAgent.includes('Win32')) {
    platform = 'Windows 32-bit';
  } else if (userAgent.includes('Macintosh')) {
    platform = 'Mac';
  } else if (userAgent.includes('Linux')) {
    platform = 'Linux';
  } else if (userAgent.includes('Android')) {
    platform = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    platform = 'iOS';
  }

  return {
    browser,
    os,
    platform
  };
}

/**
 * Captures complete upload metadata from request
 */
export function captureUploadMetadata(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const ipAddress = getClientIP(request);
  const deviceInfo = parseUserAgent(userAgent);

  return {
    ipAddress,
    userAgent,
    deviceInfo
  };
}
