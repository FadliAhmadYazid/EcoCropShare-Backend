import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import History from '@/models/History';

interface Params {
  params: {
    id: string;
  };
}

// GET history by ID
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
    
    const history = await History.findById(params.id)
      .populate('userId', 'name location profileImage')
      .populate('partnerId', 'name location profileImage');
    
    if (!history) {
      return NextResponse.json(
        { success: false, message: 'Riwayat tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Check if the logged-in user is part of this history entry
    const userIdString = typeof history.userId === 'object' && history.userId._id 
      ? history.userId._id.toString()
      : history.userId.toString();
      
    const partnerIdString = typeof history.partnerId === 'object' && history.partnerId._id 
      ? history.partnerId._id.toString()
      : history.partnerId.toString();
    
    if (userIdString !== session.user.id && partnerIdString !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak memiliki akses ke riwayat ini' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { success: true, history },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}