import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password, location, favoritePlants } = await req.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email sudah digunakan' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password, // Will be hashed by pre-save hook in User model
      location,
      favoritePlants: favoritePlants || [],
    });
    
    await user.save();
    
    // Return user without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      favoritePlants: user.favoritePlants,
      profileImage: user.profileImage,
    };
    
    return NextResponse.json({ success: true, user: userData }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}