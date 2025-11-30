import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Notification from '../../../../../models/Notification';
import { User, Designer, Buyer } from '../../../../../models/User';
import { verifyToken } from '../../../../../middleware/auth';

// POST - Admin sends notification
export async function POST(request) {
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

    const userId = authResult.decoded.userId;
    const user = authResult.user;

    // Only admins can send notifications
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can send notifications' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, message, type, link, icon, sendTo, specificUserIds } = body;

    // Validate required fields
    if (!title || !message || !sendTo) {
      return NextResponse.json(
        { error: 'Title, message, and sendTo are required' },
        { status: 400 }
      );
    }

    let recipients = [];

    // Determine recipients based on sendTo parameter
    switch (sendTo) {
      case 'all':
        // Get all users (buyers and designers)
        const allUsers = await User.find({ 
          $or: [{ userType: 'buyer' }, { userType: 'designer' }]
        }).select('_id userType');
        recipients = allUsers;
        break;

      case 'all_buyers':
        const buyers = await User.find({ 
          userType: 'buyer'
        }).select('_id userType');
        recipients = buyers;
        break;

      case 'all_designers':
        const designers = await User.find({ 
          userType: 'designer'
        }).select('_id userType');
        recipients = designers;
        break;

      case 'specific':
        if (!specificUserIds || !Array.isArray(specificUserIds) || specificUserIds.length === 0) {
          return NextResponse.json(
            { error: 'specificUserIds array is required when sendTo is "specific"' },
            { status: 400 }
          );
        }
        const specificUsers = await User.find({ 
          _id: { $in: specificUserIds }
        }).select('_id userType');
        
        if (specificUsers.length === 0) {
          return NextResponse.json(
            { error: 'No valid users found' },
            { status: 404 }
          );
        }
        recipients = specificUsers;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid sendTo parameter. Must be: all, all_buyers, all_designers, or specific' },
          { status: 400 }
        );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 404 }
      );
    }

    // Get admin name
    const adminUser = await User.findById(userId).select('name email');

    // Create notifications for all recipients
    const notifications = recipients.map(recipient => ({
      recipientId: recipient._id,
      recipientType: recipient.userType,
      title,
      message,
      type: type || 'info',
      link: link || null,
      icon: icon || null,
      senderId: userId,
      senderName: adminUser?.name || adminUser?.email || 'Admin',
      isRead: false
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${recipients.length} user(s)`,
      count: recipients.length,
      notificationIds: createdNotifications.map(n => n._id)
    }, { status: 201 });

  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
