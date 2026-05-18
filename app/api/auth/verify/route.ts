// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: 'No token provided'
    }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({
      success: false,
      error: 'Invalid or expired token'
    }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      customerId: decoded.customerId
    }
  });
}