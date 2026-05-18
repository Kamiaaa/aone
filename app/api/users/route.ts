// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import { User, generateCustomerId } from '@/models/User';
import Package from '@/models/Package';
import { verifyToken } from '@/lib/jwt';

// Helper function to generate temporary password
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

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const packageId = searchParams.get('package') || '';
    
    // Build query
    let query: any = {};
    if (role) query.role = role;
    if (packageId && mongoose.Types.ObjectId.isValid(packageId)) {
      query.package = new mongoose.Types.ObjectId(packageId);
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password -tempPassword')
      .populate('package', 'name price speed speedMbps slug') // Populate package details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    return NextResponse.json({ 
      success: true, 
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, { status: 500 });
  }
}

// POST create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await request.json();
    const { firstName, lastName, email, phone, mobileNumber, address, package: packageId } = body;
    
    // Support both 'phone' and 'mobileNumber' field names
    const finalMobileNumber = phone || mobileNumber;

    // Validate required fields
    if (!firstName || !lastName || !email || !finalMobileNumber || !address) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(finalMobileNumber.replace(/\s/g, ''))) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid phone number format (10-15 digits, optional +)' 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }

    // Check if mobile number already exists
    const existingMobile = await User.findOne({ mobileNumber: finalMobileNumber });
    if (existingMobile) {
      return NextResponse.json({ 
        success: false, 
        error: 'User with this mobile number already exists' 
      }, { status: 409 });
    }

    // Validate package if provided
    let packageObjectId = null;
    if (packageId) {
      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid package ID format' 
        }, { status: 400 });
      }
      
      const existingPackage = await Package.findById(packageId);
      if (!existingPackage) {
        return NextResponse.json({ 
          success: false, 
          error: 'Package not found' 
        }, { status: 404 });
      }
      packageObjectId = packageId;
    }

    // Generate customer ID (updated to use A1C + random numbers)
    let customerId = generateCustomerId();
    
    // Ensure customer ID is unique
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!isUnique && attempts < maxAttempts) {
      const existingId = await User.findOne({ customerId });
      if (!existingId) {
        isUnique = true;
      } else {
        customerId = generateCustomerId();
        attempts++;
      }
    }
    
    if (!isUnique) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unable to generate unique customer ID. Please try again.' 
      }, { status: 500 });
    }

    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    
    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create new user
    const user = new User({
      customerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: finalMobileNumber.trim(),
      address: address.trim(),
      password: hashedPassword,
      role: 'customer',
      isActive: true,
      tempPassword,
      package: packageObjectId,
      createdAt: new Date(),
    });

    await user.save();

    // Populate package details for response
    const populatedUser = await User.findById(user._id).populate('package', 'name price speed speedMbps slug');

    // Return user data without sensitive info
    const userResponse = {
      id: populatedUser?._id,
      customerId: populatedUser?.customerId,
      userId: populatedUser?.customerId,
      firstName: populatedUser?.firstName,
      lastName: populatedUser?.lastName,
      email: populatedUser?.email,
      phone: populatedUser?.mobileNumber,
      mobileNumber: populatedUser?.mobileNumber,
      address: populatedUser?.address,
      temporaryPassword: tempPassword,
      role: populatedUser?.role,
      isActive: populatedUser?.isActive,
      package: populatedUser?.package,
      createdAt: populatedUser?.createdAt,
    };

    return NextResponse.json({ 
      success: true, 
      data: userResponse,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let errorMessage = 'Duplicate entry';
      
      if (field === 'email') {
        errorMessage = 'User with this email already exists';
      } else if (field === 'customerId') {
        errorMessage = 'Customer ID already exists. Please try again.';
      } else if (field === 'mobileNumber') {
        errorMessage = 'User with this mobile number already exists';
      }
      
      return NextResponse.json({ 
        success: false, 
        error: errorMessage 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create user' 
    }, { status: 500 });
  }
}

// PUT update user (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Validate package if provided
    if (body.package) {
      if (body.package !== null && !mongoose.Types.ObjectId.isValid(body.package)) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid package ID format' 
        }, { status: 400 });
      }
      
      if (body.package !== null) {
        const existingPackage = await Package.findById(body.package);
        if (!existingPackage) {
          return NextResponse.json({ 
            success: false, 
            error: 'Package not found' 
          }, { status: 404 });
        }
      }
    }
    
    // Prevent updating sensitive fields
    const allowedUpdates: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobileNumber: body.mobileNumber,
      address: body.address,
      isActive: body.isActive,
      package: body.package === undefined ? undefined : body.package, // Allow setting to null
    };
    
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && 
      delete allowedUpdates[key]
    );
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password -tempPassword')
     .populate('package', 'name price speed speedMbps slug');
    
    if (!updatedUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUser,
      message: 'User updated successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update user' 
    }, { status: 500 });
  }
}

// DELETE user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Prevent deleting admin users (optional)
    const userToDelete = await User.findById(id);
    if (userToDelete?.role === 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete admin users' 
      }, { status: 403 });
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete user' 
    }, { status: 500 });
  }
}