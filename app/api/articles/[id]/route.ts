import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Article from '@/models/Article';

interface Params {
  params: {
    id: string;
  };
}

// GET article by ID
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
    
    const article = await Article.findById(params.id)
      .populate('userId', 'name profileImage location favoritePlants');
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Find related articles (same category or tags)
    let relatedQuery: any = {
      _id: { $ne: article._id } // Exclude current article
    };
    
    if (article.category) {
      relatedQuery.category = article.category;
    } else if (article.tags && article.tags.length > 0) {
      relatedQuery.tags = { $in: article.tags };
    }
    
    const relatedArticles = await Article.find(relatedQuery)
      .limit(3)
      .sort({ createdAt: -1 })
      .select('title image createdAt category')
      .populate('userId', 'name');
    
    return NextResponse.json(
      { success: true, article, relatedArticles },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update article
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
    
    const article = await Article.findById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this article
    if (article.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak mengubah artikel ini' },
        { status: 403 }
      );
    }
    
    const { title, content, image, category, tags } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan konten diperlukan' },
        { status: 400 }
      );
    }
    
    // Update fields
    article.title = title;
    article.content = content;
    article.image = image || article.image;
    article.category = category || article.category;
    article.tags = tags || article.tags;
    article.updatedAt = new Date();
    
    await article.save();
    
    return NextResponse.json(
      { success: true, article },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE article
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
    
    const article = await Article.findById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this article
    if (article.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak menghapus artikel ini' },
        { status: 403 }
      );
    }
    
    // Delete article
    await Article.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Artikel berhasil dihapus' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}