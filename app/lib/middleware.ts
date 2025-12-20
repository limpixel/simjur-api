import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
];

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS headers
function addCorsHeaders(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Handle OPTIONS preflight requests for ALL API routes
  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return addCorsHeaders(response);
  }

  // Add CORS headers to ALL API responses
  if (pathname.startsWith('/api/')) {
    // Create base response with CORS headers
    const response = NextResponse.next();
    addCorsHeaders(response);

    // Handle authentication for protected routes
    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
      return response;
    }

    // For API push routes that need special CORS handling
    if (pathname.includes('/api/push') || pathname.includes('/api/auth/push')) {
      const authHeader = req.headers.get('authorization');
      
      // Allow GET requests to push endpoints without auth for CORS
      if (req.method === 'GET' || !authHeader) {
        return response;
      }
    }

    // Default authentication check for other protected routes
    const authHeader = req.headers.get('authorization');
    if (!authHeader && !pathname.includes('/api/push')) {
      const errorResponse = new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
      return errorResponse;
    }

    // Verify JWT token if auth header exists
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          throw new Error('JWT_SECRET not configured');
        }
        jwt.verify(token, JWT_SECRET);
        return response;
      } catch (error) {
        const errorResponse = new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
        return errorResponse;
      }
    }

    return response;
  }

  // Non-API routes
  return NextResponse.next();
}