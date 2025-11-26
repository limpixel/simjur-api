import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Boleh diakses tanpa token
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}