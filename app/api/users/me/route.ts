import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// ✅ Import ALL models that might be needed for population
import '@/models/Package'; // This registers the Package model

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }

    await dbConnect();
    
    // ✅ Verify models are registered (optional debug)
    if (process.env.NODE_ENV === 'development') {
      const mongoose = require('mongoose');
      console.log('Registered models:', Object.keys(mongoose.models));
    }
    
    // Find user by ID and populate package details
    const user = await User.findById(decoded.userId)
      .select('-password -tempPassword')
      .populate('package', 'name price speed speedMbps slug');
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // Return user data with populated package
    return NextResponse.json({ 
      success: true, 
      data: user 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch user data' 
    }, { status: 500 });
  }
}