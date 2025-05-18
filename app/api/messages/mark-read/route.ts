import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

// POST to mark messages as read
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

    const { senderId } = await req.json();
    
    if (!senderId) {
      return NextResponse.json(
        { success: false, message: 'Sender ID is required' },
        { status: 400 }
      );
    }

    const currentUserId = session.user.id;

    // Mark all messages from sender to current user as read
    const result = await Message.updateMany(
      { senderId, receiverId: currentUserId, read: false },
      { read: true }
    );

    // Update unread count in conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, senderId] }
    });

    if (conversation) {
      const unreadCount = conversation.unreadCount || new Map<string, number>();
      unreadCount.set(currentUserId, 0);
      conversation.unreadCount = unreadCount;
      await conversation.save();
    }

    return NextResponse.json({ 
      success: true, 
      updatedCount: result.modifiedCount
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}