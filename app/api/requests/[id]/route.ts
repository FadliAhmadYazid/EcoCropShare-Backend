import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Request from '@/models/Request';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
  };
}

// GET request by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Validasi ID
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'ID permintaan tidak valid' },
        { status: 400 }
      );
    }
    
    const request = await Request.findById(id)
      .populate('userId', 'name location profileImage favoritePlants');
    
    if (!request) {
      return NextResponse.json(
        { success: false, message: 'Permintaan tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Get comments for this request
    const comments = await Comment.find({ 
      parentId: request._id, 
      parentType: 'request' 
    })
      .sort({ createdAt: 1 })
      .populate('userId', 'name profileImage');
    
    return NextResponse.json(
      { success: true, request, comments },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update request
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const request = await Request.findById(params.id);
    
    if (!request) {
      return NextResponse.json(
        { success: false, message: 'Permintaan tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this request
    if (request.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak mengubah permintaan ini' },
        { status: 403 }
      );
    }
    
    const { plantName, location, reason, category, quantity, status } = await req.json();
    
    // Update fields
    request.plantName = plantName || request.plantName;
    request.location = location || request.location;
    request.reason = reason || request.reason;
    request.category = category || request.category;
    request.quantity = quantity || request.quantity;
    request.status = status || request.status;
    request.updatedAt = new Date();
    
    await request.save();
    
    return NextResponse.json(
      { success: true, request },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE request
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const request = await Request.findById(params.id);
    
    if (!request) {
      return NextResponse.json(
        { success: false, message: 'Permintaan tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this request
    if (request.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak menghapus permintaan ini' },
        { status: 403 }
      );
    }
    
    // Delete request
    await Request.findByIdAndDelete(params.id);
    
    // Delete associated comments
    await Comment.deleteMany({ parentId: params.id, parentType: 'request' });
    
    return NextResponse.json(
      { success: true, message: 'Permintaan berhasil dihapus' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}