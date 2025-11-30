import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Notification from '../../../models/Notification';
import { verifyToken } from '../../../middleware/auth';

// GET - Fetch user notifications
export async function GET(request) {
  try {
    await connectDB();

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { recipientId: userId };
    if (unreadOnly) {
      filter.isRead = false;
    }

    // Fetch notifications
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalNotifications = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      recipientId: userId, 
      isRead: false 
    });

    const totalPages = Math.ceil(totalNotifications / limit);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        currentPage: page,
        totalPages,
        totalNotifications,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request) {
  try {
    await connectDB();

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      }, { status: 200 });
    } else if (notificationId) {
      // Mark specific notification as read
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { $set: { isRead: true, readAt: new Date() } },
        { new: true }
      );

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
        notification
      }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Either notificationId or markAllAsRead is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(request) {
  try {
    await connectDB();

    // Verify user authentication
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.decoded.userId;
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId is required' },
        { status: 400 }
      );
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipientId: userId
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
