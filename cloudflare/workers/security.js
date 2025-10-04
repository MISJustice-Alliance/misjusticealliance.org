/**
 * Security Headers Worker for MISJustice Alliance
 * 
 * Applies strict security headers to all responses to protect against:
 * - Cross-Site Scripting (XSS)
 * - Clickjacking
 * - MIME sniffing
 * - Man-in-the-middle attacks
 * - Information disclosure
 * 
 * Privacy: These headers also enhance privacy protection.
 */

/**
 * Security headers configuration
 */
const SECURITY_HEADERS = {
  // Content Security Policy - Prevent XSS and data injection attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'", // Only allow scripts from same origin
    "style-src 'self' 'unsafe-inline'", // Super.so may require inline styles
    "img-src 'self' data: https:", // Allow images from same origin, data URLs, and HTTPS
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src 'none'", // Prevent framing
    "frame-ancestors 'none'", // Prevent being framed
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests", // Automatically upgrade HTTP to HTTPS
    "block-all-mixed-content", // Block mixed content
  ].join('; '),

  // HTTP Strict Transport Security - Force HTTPS
  'Strict-Transport-Security':
    'max-age=31536000; includeSubDomains; preload',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME sniffing
  'X-Content-Type-Options': 'nosniff',

  // Control referrer information
  'Referrer-Policy': 'no-referrer',

  // Permissions Policy - Restrict browser features
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
  ].join(', '),

  // XSS Protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // Indicate no user tracking
  'Tk': 'N', // Tracking Status: Not tracking

  // Server identification (minimal info)
  'Server': 'Cloudflare',
};

/**
 * Add security headers to a response
 * @param {Response} response - Original response
 * @returns {Response} - Response with security headers
 */
export function addSecurityHeaders(response) {
  // Clone the response so we can modify headers
  const newHeaders = new Headers(response.headers);

  // Add all security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  // Remove headers that might leak information
  newHeaders.delete('X-Powered-By');
  newHeaders.delete('Server');

  // Create new response with security headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Get CSP for specific content types
 * Useful if different pages need different CSP policies
 * 
 * @param {string} contentType 
 * @returns {string}
 */
export function getCSPForContentType(contentType) {
  if (contentType.includes('text/html')) {
    // Stricter CSP for HTML pages
    return [
      "default-src 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
  }

  if (contentType.includes('application/json')) {
    // Very strict CSP for JSON responses
    return "default-src 'none'";
  }

  // Default CSP
  return SECURITY_HEADERS['Content-Security-Policy'];
}

/**
 * Add CORS headers for API endpoints
 * Only use this for specific API endpoints that need CORS
 * 
 * @param {Response} response 
 * @param {string} origin - Allowed origin (default: same origin only)
 * @returns {Response}
 */
export function addCORSHeaders(response, origin = 'https://misjusticealliance.org') {
  const headers = new Headers(response.headers);

  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Security headers for downloadable files
 * Prevents execution of downloaded files
 * 
 * @param {Response} response 
 * @returns {Response}
 */
export function addDownloadSecurityHeaders(response) {
  const headers = new Headers(response.headers);

  // Prevent execution
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Disposition', 'attachment');
  headers.set('X-Download-Options', 'noopen');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Check if request is using HTTPS
 * @param {Request} request 
 * @returns {boolean}
 */
export function isHTTPS(request) {
  return request.url.startsWith('https://');
}

/**
 * Redirect HTTP to HTTPS
 * @param {Request} request 
 * @returns {Response|null}
 */
export function enforceHTTPS(request) {
  if (!isHTTPS(request)) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    
    return Response.redirect(url.toString(), 301);
  }
  
  return null;
}
