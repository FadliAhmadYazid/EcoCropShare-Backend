import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Handler for PUT requests to /api/user
export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get request body
    const { name, location, favoritePlants, profileImage } = await request.json();

    // Validate required fields
    if (!name || !location) {
      return NextResponse.json(
        { success: false, message: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user data
    user.name = name;
    user.location = location;
    user.favoritePlants = favoritePlants || [];
    
    // Only update profileImage if it's provided
    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        favoritePlants: user.favoritePlants,
        profileImage: user.profileImage
      }
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET handler to verify the route is working
export async function GET() {
  return NextResponse.json({ message: "User API is working" });
}