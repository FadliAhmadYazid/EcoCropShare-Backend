import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

interface Params {
  params: {
    id: string;
  };
}

// DELETE comment
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
    
    const comment = await Comment.findById(params.id);
    
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Komentar tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Ensure user owns this comment
    if (comment.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Tidak berhak menghapus komentar ini' },
        { status: 403 }
      );
    }
    
    // Delete comment
    await Comment.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Komentar berhasil dihapus' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}