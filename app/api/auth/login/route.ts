// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { identifier, password } = body; // Changed from 'email' to 'identifier'

    // Validate input
    if (!identifier || !password) {
      return NextResponse.json({
        success: false,
        error: 'Customer ID/Email and password are required'
      }, { status: 400 });
    }

    // Find user by either email or customerId
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { customerId: identifier.trim() }
      ]
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Your account has been deactivated. Please contact administrator.'
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if this is first login with temporary password
    const isFirstLogin = user.tempPassword && await bcrypt.compare(password, user.password);
    
    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId
    });

    // Prepare user data for response (excluding sensitive info)
    const userData = {
      id: user._id,
      customerId: user.customerId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      address: user.address,
      role: user.role,
      isFirstLogin
    };

    return NextResponse.json({
      success: true,
      data: userData,
      token,
      message: isFirstLogin ? 'First time login. Please change your password.' : 'Login successful'
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred during login'
    }, { status: 500 });
  }
}