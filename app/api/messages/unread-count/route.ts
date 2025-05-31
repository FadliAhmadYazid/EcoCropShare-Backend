import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET unread messages count for current user
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

    const currentUserId = session.user.id;

    // Count all unread messages for this user
    const count = await Message.countDocuments({
      receiverId: currentUserId,
      read: false
    });

    return NextResponse.json({ 
      success: true, 
      count
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}