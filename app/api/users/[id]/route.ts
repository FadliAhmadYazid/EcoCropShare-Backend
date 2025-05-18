import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

interface Params {
  params: {
    id: string;
  };
}

// GET user by ID
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
    
    const user = await User.findById(params.id, 'name email location profileImage favoritePlants');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          location: user.location,
          profileImage: user.profileImage,
          favoritePlants: user.favoritePlants
        } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}