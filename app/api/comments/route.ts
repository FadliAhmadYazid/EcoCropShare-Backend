import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

// POST new comment
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
    
    const { parentId, parentType, content } = await req.json();
    
    if (!parentId || !parentType || !content) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }
    
    // Validate parentType
    if (parentType !== 'post' && parentType !== 'request') {
      return NextResponse.json(
        { success: false, message: 'Invalid parent type' },
        { status: 400 }
      );
    }
    
    const newComment = new Comment({
      userId: session.user.id,
      parentId,
      parentType,
      content,
      createdAt: new Date()
    });
    
    await newComment.save();
    
    // Populate user information
    await newComment.populate('userId', 'name profileImage');
    
    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}