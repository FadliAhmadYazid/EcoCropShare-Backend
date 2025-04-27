import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

interface Params {
  params: {
    id: string;
  };
}

// GET post by ID
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
    
    const post = await Post.findById(params.id)
      .populate('userId', 'name location profileImage favoritePlants');
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Get comments for this post
    const comments = await Comment.find({ 
      parentId: post._id, 
      parentType: 'post' 
    })
      .sort({ createdAt: 1 })
      .populate('userId', 'name profileImage');
    
    return NextResponse.json(
      { success: true, post, comments },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update post
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
    
    const post = await Post.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this post
    if (post.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak mengubah post ini' },
        { status: 403 }
      );
    }
    
    const { title, type, exchangeType, quantity, location, images, description, status } = await req.json();
    
    // Update fields
    post.title = title || post.title;
    post.type = type || post.type;
    post.exchangeType = exchangeType || post.exchangeType;
    post.quantity = quantity || post.quantity;
    post.location = location || post.location;
    post.images = images || post.images;
    post.description = description || post.description;
    post.status = status || post.status;
    post.updatedAt = new Date();
    
    await post.save();
    
    return NextResponse.json(
      { success: true, post },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE post
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
    
    const post = await Post.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this post
    if (post.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak menghapus post ini' },
        { status: 403 }
      );
    }
    
    // Delete post
    await Post.findByIdAndDelete(params.id);
    
    // Delete associated comments
    await Comment.deleteMany({ parentId: params.id, parentType: 'post' });
    
    return NextResponse.json(
      { success: true, message: 'Post berhasil dihapus' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}