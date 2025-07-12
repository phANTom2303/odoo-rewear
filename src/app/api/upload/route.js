import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create unique filename
    const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const tempDir = path.join(process.cwd(), 'tmp');
    const tempPath = path.join(tempDir, filename);
    
    // Ensure tmp directory exists
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Write file temporarily
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(tempPath, {
      folder: 'odoo-rewear/items',
      public_id: `item_${Date.now()}`,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    // Clean up temporary file
    try {
      await unlink(tempPath);
    } catch (error) {
      console.log('Could not delete temp file:', error);
    }

    return NextResponse.json({
      success: true,
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
