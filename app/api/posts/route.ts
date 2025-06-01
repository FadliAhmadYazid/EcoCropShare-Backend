// app/api/posts/route.ts - Fixed version (hanya untuk CRUD posts, bukan upload)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

// GET all posts
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    
    const query: any = {};
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    const skip = (page - 1) * limit;
    
    const posts = await Post.find(query)
      .populate('userId', 'name location profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, type, exchangeType, quantity, location, images, description } = await req.json();
    
    const newPost = new Post({
      userId: session.user.id,
      title,
      type,
      exchangeType,
      quantity,
      location,
      images,
      description,
      status: 'available'
    });
    
    await newPost.save();
    await newPost.populate('userId', 'name location profileImage');
    
    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Route segment config
export const runtime = 'nodejs';
export const maxDuration = 30;