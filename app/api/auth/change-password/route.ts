// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get and validate authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Current password and new password are required'
        },
        { status: 400 }
      );
    }

    // Enhanced password validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'New password must be at least 8 characters long'
        },
        { status: 400 }
      );
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        },
        { status: 400 }
      );
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'New password must be different from current password'
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find user
    const user = await User.findById(decoded.userId).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is active
    if (user.status === 'inactive' || user.isDeleted) {
      return NextResponse.json(
        { success: false, error: 'Account is inactive or deleted' },
        { status: 403 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Current password is incorrect'
        },
        { status: 401 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update user
    const updateData: any = {
      password: hashedPassword,
      lastPasswordChange: new Date(),
    };
    
    // Clear tempPassword if it exists
    if (user.tempPassword) {
      updateData.tempPassword = undefined;
    }
    
    await User.findByIdAndUpdate(decoded.userId, updateData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password changed successfully',
        data: {
          changedAt: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error changing password:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to change password. Please try again later.'
      },
      { status: 500 }
    );
  }
}