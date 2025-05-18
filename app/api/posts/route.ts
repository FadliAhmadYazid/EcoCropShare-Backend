// File: app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

// GET all posts or user posts - No authentication required
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

    let postsQuery = Post.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name location profileImage');
    
    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }

    const posts = await postsQuery;

    // Add empty comments array to each post
    const postsWithComments = posts.map(post => {
      const postObj = post.toObject();
      postObj.comments = [];
      return postObj;
    });

    // Fetch all comment counts in a single query for better performance
    const commentCounts = await (Comment as any).aggregate([
      {
        $match: {
          parentType: 'post',
          parentId: { $in: posts.map(post => post._id) }
        }
      },
      {
        $group: {
          _id: '$parentId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Update the posts with comment counts
    for (const count of commentCounts) {
      const post = postsWithComments.find(p => 
        p._id.toString() === count._id.toString()
      );
      if (post) {
        post.comments = new Array(count.count);
      }
    }

    return NextResponse.json({ success: true, posts: postsWithComments }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new post - Authentication required
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
      images: images || [],
      description,
      status: 'available',
    });

    await newPost.save();

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}