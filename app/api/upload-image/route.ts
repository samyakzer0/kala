import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { validateAdminKey, getClientIP } from '../../../utils/auth';

/**
 * Validate image file signature (magic bytes)
 */
function validateImageSignature(buffer: Buffer, mimeType: string): boolean {
  const signature = buffer.subarray(0, 8);
  
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      return signature[0] === 0xFF && signature[1] === 0xD8 && signature[2] === 0xFF;
    case 'image/png':
      return signature[0] === 0x89 && signature[1] === 0x50 && 
             signature[2] === 0x4E && signature[3] === 0x47;
    case 'image/webp':
      return signature[0] === 0x52 && signature[1] === 0x49 && 
             signature[2] === 0x46 && signature[3] === 0x46 &&
             signature[8] === 0x57 && signature[9] === 0x45 && 
             signature[10] === 0x42 && signature[11] === 0x50;
    default:
      return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const adminKey = formData.get('adminKey') as string;
    const category = formData.get('category') as string || 'products';
    
    // Secure admin authentication with rate limiting
    const clientIP = getClientIP(request);
    try {
      if (!validateAdminKey(adminKey, clientIP)) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }, { status: 429 });
    }
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }
    
    // Enhanced file validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }
    
    // Read file content for additional validation
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Validate file signature (magic bytes)
    // const fileSignature = buffer.subarray(0, 12); // Removed unused variable
    const isValidImage = validateImageSignature(buffer, file.type);
    
    if (!isValidImage) {
      return NextResponse.json({ 
        success: false, 
        message: 'File content does not match declared type.' 
      }, { status: 400 });
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }
    
    // Validate and sanitize category input
    const allowedCategories = ['rings', 'necklaces', 'earrings', 'bracelets', 'products'];
    const sanitizedCategory = allowedCategories.includes(category) ? category : 'products';
    
    if (category !== sanitizedCategory) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid category. Must be one of: rings, necklaces, earrings, bracelets, products' 
      }, { status: 400 });
    }
    
    // Generate unique filename with additional validation
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.name).toLowerCase();
    
    // Validate file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file extension' 
      }, { status: 400 });
    }
    
    const filename = `${sanitizedCategory}-${timestamp}-${randomString}${fileExtension}`;
    
    // Use path.resolve to prevent path traversal
    const imagesDir = path.resolve(process.cwd(), 'public', 'images', sanitizedCategory);
    const filepath = path.resolve(imagesDir, filename);
    
    // Ensure the resolved path is within the expected directory
    if (!filepath.startsWith(imagesDir)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid file path' 
      }, { status: 400 });
    }
    try {
      await mkdir(imagesDir, { recursive: true });
    } catch (/* eslint-disable-line @typescript-eslint/no-unused-vars */ _error) {
      // Directory might already exist, ignore error
    }
    
    // Write the file
    await writeFile(filepath, buffer);
    
    // Return the relative path for the frontend
    const relativePath = `/images/${category}/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      imagePath: relativePath,
      filename: filename,
      message: 'Image uploaded successfully' 
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error uploading image' 
    }, { status: 500 });
  }
}
