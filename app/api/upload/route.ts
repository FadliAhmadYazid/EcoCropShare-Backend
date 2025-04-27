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
    console.log('Upload endpoint called');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Unauthorized: No session found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('User ID from session:', session.user.id);
    
    // Get data from form
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    console.log('File received:', file.name, file.type, file.size);
    
    // Read file as buffer
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;
    
    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary with profiles folder
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        { 
          folder: 'ecocropshare/profiles',
          public_id: `user_${session.user.id}`,
          overwrite: true // Overwrite old image with the same ID
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result?.secure_url);
            resolve(result);
          }
        }
      );
    });
    
    // Return URL of successfully uploaded image
    const imageUrl = (result as any).secure_url;
    console.log('Returning image URL:', imageUrl);
    
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}