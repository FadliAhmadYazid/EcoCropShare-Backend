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

// Helper function untuk validasi environment variables
function validateCloudinaryConfig() {
  const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary environment variables: ${missing.join(', ')}`);
  }
}

// Helper function untuk validasi file
function validateFile(file: File) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum 5MB allowed.');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Validate Cloudinary config first
    validateCloudinaryConfig();
    
    // 2. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. Parse form data with size limit check
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Request payload too large or invalid' },
        { status: 413 }
      );
    }

    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'post';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 4. Validate file
    try {
      validateFile(file);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // 5. Convert file to buffer with timeout
    let buffer: ArrayBuffer;
    try {
      // Set a timeout untuk prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('File processing timeout')), 8000)
      );
      
      buffer = await Promise.race([
        file.arrayBuffer(),
        timeoutPromise
      ]) as ArrayBuffer;
      
    } catch (error) {
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
      // Add transformation untuk optimize
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    // 7. Upload to Cloudinary with proper error handling
    let result;
    try {
      result = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Cloudinary upload timeout'));
        }, 8000); // 8 second timeout
        
        cloudinary.uploader.upload(
          dataURI,
          uploadOptions,
          (error, uploadResult) => {
            clearTimeout(timeoutId);
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error(`Upload failed: ${error.message}`));
            } else if (!uploadResult) {
              reject(new Error('Upload failed: No result from Cloudinary'));
            } else {
              resolve(uploadResult);
            }
          }
        );
      });
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: error.message || 'Failed to upload image to cloud storage' 
        },
        { status: 500 }
      );
    }

    // 8. Validate result
    const imageUrl = (result as any)?.secure_url;
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Upload completed but no URL received' },
        { status: 500 }
      );
    }

    // 9. Return success response
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      publicId: (result as any).public_id
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    
    // Return proper JSON error response
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Export config untuk Next.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};