// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Package from '@/models/Package';

// GET - Fetch single package by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Check if id is MongoDB ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };
    
    const packageData = await Package.findOne(query).lean();
    
    if (!packageData) {
      return NextResponse.json({
        success: false,
        error: 'Package not found',
      }, { status: 404 });
    }
    
    // Convert _id to string for client-side use
    const serializedData = {
      ...packageData,
      _id: packageData._id.toString(),
    };
    
    return NextResponse.json({
      success: true,
      data: serializedData,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch package',
    }, { status: 500 });
  }
}

// PUT - Update a package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    
    // Remove sensitive/read-only fields if they exist in the body
    const { _id, __v, createdAt, ...updateData } = body;
    
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { 
        new: true,  // This replaces the deprecated 'new' option
        runValidators: true 
      }
    ).lean();
    
    if (!updatedPackage) {
      return NextResponse.json({
        success: false,
        error: 'Package not found',
      }, { status: 404 });
    }
    
    const serializedData = {
      ...updatedPackage,
      _id: updatedPackage._id.toString(),
    };
    
    return NextResponse.json({
      success: true,
      data: serializedData,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating package:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update package',
    }, { status: 500 });
  }
}

// DELETE - Delete a package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const deletedPackage = await Package.findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return NextResponse.json({
        success: false,
        error: 'Package not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete package',
    }, { status: 500 });
  }
}