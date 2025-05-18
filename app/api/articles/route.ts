// File: app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Article from '@/models/Article';

// GET all articles - No authentication required
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    const search = url.searchParams.get('search');
    const limit = url.searchParams.get('limit');
    
    let query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    let articlesQuery = Article.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name profileImage');
    
    if (limit) {
      articlesQuery = articlesQuery.limit(parseInt(limit));
    }
    
    const articles = await articlesQuery;
    
    return NextResponse.json({ success: true, articles }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new article - Authentication required
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
    
    const { title, content, image, category, tags } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan konten diperlukan' },
        { status: 400 }
      );
    }
    
    const newArticle = new Article({
      userId: session.user.id,
      title,
      content,
      image: image || '',
      category: category || '',
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newArticle.save();
    
    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}