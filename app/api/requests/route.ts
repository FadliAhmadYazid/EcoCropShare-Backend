// File: app/api/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Request from '@/models/Request';
import Comment from '@/models/Comment';

// GET all requests or user requests - No authentication required
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');
    const limit = url.searchParams.get('limit');
    
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (status) {
      query.status = status;
    }
    
    let requestsQuery = Request.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name location profileImage');
    
    if (limit) {
      requestsQuery = requestsQuery.limit(parseInt(limit));
    }
    
    const requests = await requestsQuery;
    
    // Add comments count
    const requestsWithComments = await Promise.all(
      requests.map(async (request) => {
        const requestObj = request.toObject();
        
        // Count comments for this request
        const commentCount = await Comment.countDocuments({
          parentId: request._id,
          parentType: 'request'
        });
        
        requestObj.comments = new Array(commentCount);
        return requestObj;
      })
    );
    
    return NextResponse.json({ success: true, requests: requestsWithComments }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new request - Authentication required
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
    
    const { plantName, location, reason, category, quantity } = await req.json();
    
    const newRequest = new Request({
      userId: session.user.id,
      plantName,
      location,
      reason,
      category: category || 'buah',
      quantity: quantity || '1',
      status: 'open',
    });
    
    await newRequest.save();
    
    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}