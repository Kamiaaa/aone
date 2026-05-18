// app/api/auth/register-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      mobileNumber, 
      address, 
      password,
      adminSecretKey 
    } = body;

    // Verify admin secret key
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'your-super-secret-admin-key';
    
    if (adminSecretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid admin secret key' 
      }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User already exists' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      mobileNumber,
      address,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      customerId: `ADMIN${Date.now()}`,
      createdAt: new Date()
    });

    await admin.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create admin user' 
    }, { status: 500 });
  }
}