// app/api/upload/route.ts - Fixed version without deprecated config
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

function validateCloudinaryConfig() {
  const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing Cloudinary environment variables:', missing);
    throw new Error(`Missing Cloudinary environment variables: ${missing.join(', ')}`);
  }
}

function validateFile(file: File) {
  const maxSize = 4 * 1024 * 1024; // 4MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum 4MB allowed.');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Upload API called');
    
    // 1. Validate Cloudinary config first
    validateCloudinaryConfig();
    console.log('Cloudinary config validated');
    
    // 2. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('Session validated for user:', session.user.id);

    // 3. Parse form data
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error('Form data parsing error:', error);
      return NextResponse.json(
        { success: false, message: 'Request payload too large or invalid' },
        { status: 413 }
      );
    }

    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'post';

    if (!file) {
      console.log('No file in form data');
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, file.size, file.type);

    // 4. Validate file
    try {
      validateFile(file);
    } catch (error: any) {
      console.error('File validation error:', error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // 5. Convert file to buffer
    let buffer: ArrayBuffer;
    try {
      buffer = await file.arrayBuffer();
      console.log('File buffer created, size:', buffer.byteLength);
    } catch (error) {
      console.error('File buffer error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to process file' },
        { status: 500 }
      );
    }

    const base64Data = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // 6. Set upload configuration
    let folder = 'ecocropshare/posts';
    let publicId = `post_${session.user.id}_${Date.now()}`;

    if (uploadType === 'profile') {
      folder = 'ecocropshare/profiles';
      publicId = `user_${session.user.id}`;
    } else if (uploadType === 'article') {
      folder = 'ecocropshare/articles';
      publicId = `article_${session.user.id}_${Date.now()}`;
    }

    const uploadOptions = {
      folder: folder,
      public_id: publicId,
      overwrite: uploadType === 'profile',
      resource_type: 'image' as const,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    console.log('Starting Cloudinary upload with options:', uploadOptions);

    // 7. Upload to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(dataURI, uploadOptions);
      console.log('Cloudinary upload successful:', result.secure_url);
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Upload failed: ${error.message}` 
        },
        { status: 500 }
      );
    }

    // 8. Validate result
    const imageUrl = result?.secure_url;
    if (!imageUrl) {
      console.error('No image URL in result:', result);
      return NextResponse.json(
        { success: false, message: 'Upload completed but no URL received' },
        { status: 500 }
      );
    }

    console.log('Upload successful, returning response');

    // 9. Return success response
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      publicId: result.public_id
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Route segment config (New App Router way)
export const runtime = 'nodejs';
export const maxDuration = 30;