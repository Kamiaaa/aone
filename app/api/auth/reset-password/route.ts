// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/jwt';

function generateTemporaryPassword(): string {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Customer ID is required' 
      }, { status: 400 });
    }

    await dbConnect();

    const customer = await User.findById(customerId);
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    // Generate new temporary password
    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update password and set tempPassword flag
    customer.password = hashedPassword;
    customer.tempPassword = tempPassword;
    await customer.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      temporaryPassword: tempPassword
    }, { status: 200 });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset password' 
    }, { status: 500 });
  }
}