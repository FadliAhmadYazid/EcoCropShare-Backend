import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// GET all conversations for the current user
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
    const userId = url.searchParams.get('userId');

    // If a userId is provided, get messages between current user and specified user
    if (userId) {
      const currentUserId = session.user.id;

      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [currentUserId, userId] }
      });

      // If no conversation exists, return empty messages array
      if (!conversation) {
        return NextResponse.json({ 
          success: true, 
          messages: [],
          conversation: null
        }, { status: 200 });
      }

      // Get messages
      const messages = await Message.find({
        $or: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      }).sort({ createdAt: 1 });

      // Update unread status for messages received by current user
      await Message.updateMany(
        { 
          senderId: userId, 
          receiverId: currentUserId,
          read: false
        },
        { read: true }
      );

      // Update unread count in conversation
      const unreadCount = conversation.unreadCount || new Map();
      unreadCount.set(currentUserId, 0);
      conversation.unreadCount = unreadCount;
      await conversation.save();

      return NextResponse.json({ 
        success: true, 
        messages,
        conversation
      }, { status: 200 });
    } 
    // Otherwise, get all conversations for current user
    else {
      const currentUserId = session.user.id;
      
      const conversations = await Conversation.find({
        participants: currentUserId
      })
      .populate('participants', 'name email profileImage location')
      .sort({ updatedAt: -1 });

      return NextResponse.json({ 
        success: true, 
        conversations 
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new message
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

    const { receiverId, content } = await req.json();

    if (!receiverId || !content.trim()) {
      return NextResponse.json(
        { success: false, message: 'Receiver ID and content are required' },
        { status: 400 }
      );
    }

    const senderId = session.user.id;

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      read: false,
    });

    await newMessage.save();

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // Initialize with typed unreadCount Map
      const unreadCount = new Map<string, number>();
      unreadCount.set(receiverId, 1);
      
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: content,
        lastMessageDate: new Date(),
        unreadCount: unreadCount
      });
    } else {
      conversation.lastMessage = content;
      conversation.lastMessageDate = new Date();
      
      // Update unread count - ensure we're working with numbers
      const unreadCount = conversation.unreadCount || new Map<string, number>();
      const currentCount = unreadCount.get(receiverId) || 0;
      unreadCount.set(receiverId, currentCount + 1);
      conversation.unreadCount = unreadCount;
    }

    await conversation.save();

    return NextResponse.json({ 
      success: true, 
      message: newMessage,
      conversation
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}