import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyTokenFromRequest(req: Request): any {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  
  // update - custom mesasge erro 
  if (!authHeader) {
    const error = new Error('Authorization header is required. Please provide a valid token.');
    (error as any).status = 401;
    (error as any).code = 'MISSING_AUTH_HEADER';
    throw error;
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  const JWT_SECRET = process.env.JWT_SECRET!;
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    const error = new Error('Invalid or expired token. Please login again to get a new token.');
    (error as any).status = 401;
    (error as any).code = 'INVALID_TOKEN';
    throw error;
  }
}
