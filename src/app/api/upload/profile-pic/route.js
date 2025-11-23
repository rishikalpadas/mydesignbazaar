import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { verifyToken } from '../../../../middleware/auth'
import connectDB from '../../../../lib/mongodb'
import ProfilePicture from '../../../../models/ProfilePicture'
import { User } from '../../../../models/User'

export async function POST(request) {
  try {
    await connectDB()

    // Verify authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResult.decoded.userId;

    // Get user to determine user type
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type - only jpg, jpeg, png allowed
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Check if user already has a profile picture
    const existingProfilePic = await ProfilePicture.findOne({ userId });
    
    // If exists, delete the old file
    if (existingProfilePic) {
      const oldFilePath = path.join(process.cwd(), 'public', existingProfilePic.imageUrl);
      if (existsSync(oldFilePath)) {
        try {
          await unlink(oldFilePath);
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = path.extname(file.name)
    const filename = `${timestamp}-${random}${ext}`

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pics')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return the public URL
    const fileUrl = `/uploads/profile-pics/${filename}`

    // Save or update in database
    const profilePicData = {
      userId,
      userType: user.userType,
      imageUrl: fileUrl,
      filename,
      fileSize: file.size,
      mimeType: file.type,
    };

    let savedProfilePic;
    if (existingProfilePic) {
      // Update existing record
      savedProfilePic = await ProfilePicture.findOneAndUpdate(
        { userId },
        profilePicData,
        { new: true }
      );
    } else {
      // Create new record
      savedProfilePic = await ProfilePicture.create(profilePicData);
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
      profilePicture: {
        id: savedProfilePic._id,
        imageUrl: savedProfilePic.imageUrl,
        uploadedAt: savedProfilePic.uploadedAt,
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload profile picture', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Fetch user's profile picture
export async function GET(request) {
  try {
    await connectDB()

    // Verify authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResult.decoded.userId;

    // Find profile picture for this user
    const profilePicture = await ProfilePicture.findOne({ userId });

    if (!profilePicture) {
      return NextResponse.json(
        { success: true, profilePicture: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      profilePicture: {
        id: profilePicture._id,
        imageUrl: profilePicture.imageUrl,
        filename: profilePicture.filename,
        fileSize: profilePicture.fileSize,
        mimeType: profilePicture.mimeType,
        uploadedAt: profilePicture.uploadedAt,
        updatedAt: profilePicture.updatedAt,
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Profile picture fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile picture', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove user's profile picture
export async function DELETE(request) {
  try {
    await connectDB()

    // Verify authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResult.decoded.userId;

    // Find and delete profile picture
    const profilePicture = await ProfilePicture.findOne({ userId });

    if (!profilePicture) {
      return NextResponse.json(
        { error: 'Profile picture not found' },
        { status: 404 }
      );
    }

    // Delete the file from filesystem
    const filePath = path.join(process.cwd(), 'public', profilePicture.imageUrl);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Delete from database
    await ProfilePicture.deleteOne({ userId });

    return NextResponse.json({
      success: true,
      message: 'Profile picture deleted successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Profile picture delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete profile picture', details: error.message },
      { status: 500 }
    )
  }
}
