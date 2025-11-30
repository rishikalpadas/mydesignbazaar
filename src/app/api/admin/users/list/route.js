import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import { User, Designer, Buyer } from '../../../../../models/User';
import { verifyToken } from '../../../../../middleware/auth';

// GET - Fetch all users for admin (for notifications dropdown)
export async function GET(request) {
  try {
    await connectDB();

    // Verify admin authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;

    // Only admins can access user list
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can access user list' },
        { status: 403 }
      );
    }

    // Get search query from URL params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const userType = searchParams.get('userType') || 'all'; // all, buyer, designer

    let allUsers = [];

    // Fetch based on user type
    if (userType === 'buyer' || userType === 'all') {
      // Fetch buyers with their profile data
      const buyers = await Buyer.find({})
        .select('_id userId fullName email')
        .sort({ fullName: 1 })
        .limit(100)
        .lean();
      
      const buyersWithType = buyers.map(buyer => ({
        _id: buyer.userId || buyer._id,
        name: buyer.fullName,
        email: buyer.email,
        userType: 'buyer'
      }));
      allUsers = [...allUsers, ...buyersWithType];
    }

    if (userType === 'designer' || userType === 'all') {
      // Fetch designers with their profile data
      const designers = await Designer.find({})
        .select('_id userId fullName email')
        .sort({ fullName: 1 })
        .limit(100)
        .lean();
      
      const designersWithType = designers.map(designer => ({
        _id: designer.userId || designer._id,
        name: designer.fullName,
        email: designer.email,
        userType: 'designer'
      }));
      allUsers = [...allUsers, ...designersWithType];
    }

    // Apply search filter if provided
    let filteredUsers = allUsers;
    if (search) {
      const query = search.toLowerCase();
      filteredUsers = allUsers.filter(user => 
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    }

    // Sort by name
    filteredUsers.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });

    return NextResponse.json({
      success: true,
      users: filteredUsers.slice(0, 100), // Limit to 100
      count: filteredUsers.length
    });

  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
