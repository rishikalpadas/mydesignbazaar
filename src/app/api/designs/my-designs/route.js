import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Design from '@/models/Design'
import {User} from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    // Connect to database
    await connectDB()
    
    // Get and verify JWT token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Get user and verify they're a designer
    const user = await User.findById(decoded.userId)
    if (!user || user.userType !== 'designer') {
      return NextResponse.json({ error: 'Only designers can view their designs' }, { status: 403 })
    }
    
    // Get URL parameters for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'newest'
    
    // Build query
    const query = { uploadedBy: user._id }
    if (status !== 'all') {
      query.status = status
    }
    
    // Build sort options
    let sortOptions = {}
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 }
        break
      case 'oldest':
        sortOptions = { createdAt: 1 }
        break
      case 'mostViewed':
        sortOptions = { views: -1 }
        break
      case 'mostDownloaded':
        sortOptions = { downloads: -1 }
        break
      case 'title':
        sortOptions = { title: 1 }
        break
      default:
        sortOptions = { createdAt: -1 }
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Fetch designs with pagination
    const designs = await Design.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'profile.fullName email')
      .populate('approvedBy', 'profile.fullName email')
      .lean()
    
    // Get total count for pagination
    const totalDesigns = await Design.countDocuments(query)
    const totalPages = Math.ceil(totalDesigns / limit)
    
    // Get statistics for the user
    const stats = await Design.aggregate([
      { $match: { uploadedBy: user._id } },
      {
        $group: {
          _id: null,
          totalDesigns: { $sum: 1 },
          approvedDesigns: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pendingDesigns: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          rejectedDesigns: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' }
        }
      }
    ])
    
    const userStats = stats[0] || {
      totalDesigns: 0,
      approvedDesigns: 0,
      pendingDesigns: 0,
      rejectedDesigns: 0,
      totalViews: 0,
      totalDownloads: 0
    }
    
    // Add virtual fields for image URLs
    const designsWithUrls = designs.map(design => ({
      ...design,
      previewImageUrl: design.previewImage ? 
        `/uploads/designs/${design._id}/preview/${design.previewImage.filename}` : null
    }))
    
    return NextResponse.json({
      success: true,
      designs: designsWithUrls,
      pagination: {
        currentPage: page,
        totalPages,
        totalDesigns,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: userStats
    })
    
  } catch (error) {
    console.error('Fetch designs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    )
  }
}