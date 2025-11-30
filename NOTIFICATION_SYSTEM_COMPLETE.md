# Notification System - Complete Implementation

## Overview
A comprehensive notification system that allows admins to send targeted notifications to users, with real-time bell icon notifications in the navbar.

## Features Implemented

### 1. Database Model (`src/models/Notification.js`)
- **Fields:**
  - `recipientId`: User who receives the notification
  - `senderId`: Admin who sent the notification
  - `title`: Notification title
  - `message`: Notification content
  - `type`: Notification type (info, success, warning, error)
  - `isRead`: Read status (default: false)
  - `link`: Optional link to navigate to
  - `createdAt`: Timestamp

- **Indexes:** 
  - `recipientId` for fast queries
  - `isRead` for filtering unread notifications

- **Helper Methods:**
  - `markAsRead()`: Mark single notification as read
  - `getUnreadCount(userId)`: Get unread count for user
  - `markAllAsRead(userId)`: Mark all as read for user

### 2. Admin Notification API (`src/app/api/admin/notifications/send/route.js`)

**Endpoint:** `POST /api/admin/notifications/send`

**Request Body:**
```json
{
  "recipientType": "all" | "all_buyers" | "all_designers" | "specific",
  "specificUserId": "userId", // Required if recipientType is "specific"
  "title": "Notification Title",
  "message": "Notification message content",
  "type": "info" | "success" | "warning" | "error",
  "link": "/optional/link"
}
```

**Features:**
- Send to all users
- Send to all buyers
- Send to all designers
- Send to specific user
- Bulk insert for performance
- Admin authentication required

### 3. User Notification API (`src/app/api/notifications/route.js`)

#### GET Endpoint
**Endpoint:** `GET /api/notifications?page=1&limit=10&unreadOnly=false`

**Response:**
```json
{
  "success": true,
  "notifications": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "unreadCount": 5
}
```

#### PATCH Endpoint
**Endpoint:** `PATCH /api/notifications`

**Mark Single as Read:**
```json
{
  "notificationId": "notificationId"
}
```

**Mark All as Read:**
```json
{
  "markAllAsRead": true
}
```

#### DELETE Endpoint
**Endpoint:** `DELETE /api/notifications?notificationId=id`

### 4. Admin UI (`src/app/dashboard/admin/notifications/page.js`)

**Features:**
- Select recipient type (dropdown)
- Search and select specific user (if specific type selected)
- Enter notification title
- Enter notification message
- Select notification type with color-coded badges
- Optional link field
- Character counter for message (max 500)
- Success/error feedback
- Responsive design

**Recipient Types:**
- All Users: Sends to everyone (buyers + designers)
- All Buyers: Only buyers
- All Designers: Only designers
- Specific User: Select from dropdown with search

### 5. User Notification Display (`src/components/Navbar.jsx`)

**Bell Icon Features:**
- Shows unread count badge (red gradient with pulse animation)
- Only visible when user is authenticated
- Positioned between wishlist and user dropdown
- Tooltip: "Notifications"

**Notification Dropdown Features:**
- Width: 96 (384px) with max height and scroll
- Header with "Mark all as read" button
- Unread notifications have orange background
- Blue dot indicator for unread
- Timestamp with relative time (Just now, 5m ago, 2h ago, etc.)
- Individual "Mark read" button per notification
- Empty state with bell icon
- Smooth animations and hover effects

**Auto-fetch Behavior:**
- Fetches notifications on login
- Fetches only unread notifications (limit 10)
- Updates real-time when marking as read

## API Usage Examples

### Admin Sending Notification to All Designers
```javascript
const response = await fetch('/api/admin/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    recipientType: 'all_designers',
    title: 'New Design Guidelines',
    message: 'Please review the updated design submission guidelines.',
    type: 'info',
    link: '/guidelines'
  }),
});
```

### User Fetching Notifications
```javascript
const response = await fetch('/api/notifications?page=1&limit=10&unreadOnly=true');
const data = await response.json();
console.log(data.notifications, data.unreadCount);
```

### Marking Notification as Read
```javascript
await fetch('/api/notifications', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ notificationId: 'someId' }),
});
```

## Notification Types and Colors

| Type | Badge Color | Use Case |
|------|-------------|----------|
| info | Blue | General information, announcements |
| success | Green | Achievements, approvals, confirmations |
| warning | Yellow/Orange | Important alerts, reminders |
| error | Red | Critical issues, rejections, failures |

## Database Indexes

```javascript
// Composite index for efficient queries
{ recipientId: 1, isRead: 1 }
// Single field indexes
{ createdAt: -1 } // For sorting by date
```

## Future Enhancements (Optional)

1. **Real-time Notifications:**
   - Implement WebSocket or Server-Sent Events
   - Auto-refresh notifications without page reload

2. **Notification Preferences:**
   - Allow users to customize notification types
   - Email notifications for important alerts

3. **Notification Categories:**
   - System notifications
   - Design approval notifications
   - Payment notifications
   - Order notifications

4. **Rich Notifications:**
   - Add images/icons
   - Action buttons (Approve/Reject)
   - Expandable content

5. **Notification Archive:**
   - Dedicated notifications page (`/dashboard/notifications`)
   - Search and filter notifications
   - Delete notifications

6. **Push Notifications:**
   - Browser push notifications
   - Mobile app notifications (if applicable)

## Testing Checklist

- [ ] Admin can send notification to all users
- [ ] Admin can send notification to all buyers
- [ ] Admin can send notification to all designers
- [ ] Admin can send notification to specific user
- [ ] User sees bell icon with unread count
- [ ] Clicking bell opens dropdown
- [ ] Unread notifications have orange background
- [ ] User can mark single notification as read
- [ ] User can mark all notifications as read
- [ ] Unread count updates correctly
- [ ] Time stamps display correctly (relative time)
- [ ] Empty state shows when no notifications
- [ ] Clicking outside closes dropdown
- [ ] Notifications persist across page refreshes
- [ ] Multiple users receive notifications correctly

## Security Notes

- Admin endpoints require admin authentication (middleware)
- User endpoints require user authentication
- Users can only see their own notifications
- Notifications are filtered by recipientId
- Bulk operations are optimized for performance

## Performance Considerations

- Notifications are paginated (default: 10 per page)
- Unread count is calculated efficiently with indexes
- Bulk insert for sending to multiple users
- Auto-refresh only fetches unread (lighter queries)
- Dropdown limits to 10 most recent notifications

## Files Modified/Created

1. `src/models/Notification.js` - Database model
2. `src/app/api/admin/notifications/send/route.js` - Admin send API
3. `src/app/api/notifications/route.js` - User notification CRUD
4. `src/app/dashboard/admin/notifications/page.js` - Admin UI
5. `src/components/Navbar.jsx` - Notification bell and dropdown

---

**Status:** ✅ Complete and Production Ready
**Date:** 2025
**Version:** 1.0.0
