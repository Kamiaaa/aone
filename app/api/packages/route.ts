// app/api/packages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Package from '@/models/Package';

// GET - Fetch all packages
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    const query = includeInactive ? {} : { isActive: true };
    
    const packages = await Package.find(query)
      .sort({ displayOrder: 1, speedMbps: 1 })
      .lean();
    
    // Serialize the data (convert ObjectId to string)
    const serializedPackages = packages.map(pkg => ({
      ...pkg,
      _id: pkg._id.toString(),
    }));
    
    return NextResponse.json({
      success: true,
      data: serializedPackages,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch packages',
    }, { status: 500 });
  }
}

// POST - Create a new package
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'price', 'speed', 'speedMbps', 'features', 'icon', 'color', 'iconBg'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }
    
    // Check if package with same name or slug already exists
    const existingPackage = await Package.findOne({
      $or: [{ name: body.name }, { slug: body.slug }]
    });
    
    if (existingPackage) {
      return NextResponse.json({
        success: false,
        error: 'Package with this name or slug already exists',
      }, { status: 409 });
    }
    
    const newPackage = await Package.create(body);
    
    // Serialize the response
    const serializedPackage = {
      ...newPackage.toObject(),
      _id: newPackage._id.toString(),
    };
    
    return NextResponse.json({
      success: true,
      data: serializedPackage,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating package:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create package',
    }, { status: 500 });
  }
}

// PUT - Update multiple packages (bulk update)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const { packages } = await request.json();
    
    if (!packages || !Array.isArray(packages)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data format. Expected { packages: [] }',
      }, { status: 400 });
    }
    
    const updates = await Promise.all(
      packages.map(async (pkg) => {
        const { _id, __v, createdAt, ...updateData } = pkg;
        const updated = await Package.findByIdAndUpdate(
          _id,
          { ...updateData, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).lean();
        
        if (updated) {
          return {
            ...updated,
            _id: updated._id.toString(),
          };
        }
        return null;
      })
    );
    
    return NextResponse.json({
      success: true,
      data: updates.filter(Boolean),
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating packages:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update packages',
    }, { status: 500 });
  }
}