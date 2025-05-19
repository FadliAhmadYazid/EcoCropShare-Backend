import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get data from form
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'post'; // Default to post if not specified

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Read file as buffer
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // Set folder based on upload type
    let folder = 'ecocropshare/posts';
    let publicId = `post_${session.user.id}_${Date.now()}`;

    if (uploadType === 'profile') {
      folder = 'ecocropshare/profiles';
      publicId = `user_${session.user.id}`;
    } else if (uploadType === 'article') {
      folder = 'ecocropshare/articles';
      publicId = `article_${session.user.id}_${Date.now()}`;
    }

    // Set upload options
    const uploadOptions = {
      folder: folder,
      public_id: publicId,
      overwrite: uploadType === 'profile' // Only overwrite for profile photos
    };

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Return URL of successfully uploaded image
    const imageUrl = (result as any).secure_url;

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}