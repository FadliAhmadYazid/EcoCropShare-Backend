import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import History from '@/models/History';
import Post from '@/models/Post';
import Request from '@/models/Request';

// GET user history
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const role = url.searchParams.get('role');
    
    let query: any = {
      $or: [
        { userId: session.user.id },
        { partnerId: session.user.id }
      ]
    };
    
    if (type && (type === 'post' || type === 'request')) {
      query.type = type;
    }
    
    if (role) {
      if (role === 'giver') {
        // User is the giver (userId)
        query = { userId: session.user.id };
      } else if (role === 'receiver') {
        // User is the receiver (partnerId)
        query = { partnerId: session.user.id };
      }
    }
    
    const history = await History.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name profileImage')
      .populate('partnerId', 'name profileImage');
    
    return NextResponse.json({ success: true, history }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new history entry
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
    
    const { postId, requestId, partnerId, plantName, notes, type } = await req.json();
    
    if ((!postId && !requestId) || !partnerId || !plantName || !type) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }
    
    // Validate type
    if (type !== 'post' && type !== 'request') {
      return NextResponse.json(
        { success: false, message: 'Invalid type' },
        { status: 400 }
      );
    }
    
    // Create new history entry
    const newHistory = new History({
      postId,
      requestId,
      userId: session.user.id,
      partnerId,
      plantName,
      date: new Date(),
      notes: notes || '',
      type
    });
    
    await newHistory.save();
    
    // Update status of post or request
    if (postId) {
      await Post.findByIdAndUpdate(postId, { status: 'completed' });
    }
    
    if (requestId) {
      await Request.findByIdAndUpdate(requestId, { status: 'fulfilled' });
    }
    
    return NextResponse.json({ success: true, history: newHistory }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating history:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}