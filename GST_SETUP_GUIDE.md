# GST Management System - Setup Guide

Complete GST management system for MyDesignBazaar with super admin controls.

---

## ✅ What's Implemented

### 1. **SystemSettings Model**
Location: [src/models/SystemSettings.js](src/models/SystemSettings.js)
- Flexible key-value store for platform settings
- Supports multiple data types (string, number, boolean, json)
- Category-based organization
- Built-in methods for easy get/set operations

### 2. **Admin API Endpoints**
Location: [src/app/api/admin/settings/route.js](src/app/api/admin/settings/route.js)
- `GET /api/admin/settings` - Get all settings or by category (Super Admin only)
- `GET /api/admin/settings?key=gst_percentage` - Get specific setting
- `GET /api/admin/settings?public=true` - Public endpoint for GST (no auth needed)
- `PUT /api/admin/settings` - Update settings (Super Admin only)
- `POST /api/admin/settings/initialize` - Initialize default settings

### 3. **Settings Dashboard Page**
Location: [src/app/dashboard/settings/page.js](src/app/dashboard/settings/page.js)
- Beautiful UI for managing all system settings
- Real-time GST percentage updates
- Category-based organization (Tax, Payment, Security, etc.)
- Super Admin only access

### 4. **Updated Pricing Page**
Location: [src/app/pricing/page.js](src/app/pricing/page.js)
- Automatically fetches GST percentage from backend
- Shows price breakdown: Base Price + GST = Total
- Updates in real-time when GST is changed
- Works for both subscription plans and pay-per-download

### 5. **Admin Dashboard Integration**
Location: [src/components/dashboard/AdminDashboard.jsx](src/components/dashboard/AdminDashboard.jsx)
- New "System Settings" quick action card
- Direct link to settings page
- Only visible to Super Admins

---

## 🚀 Setup Instructions

### Step 1: Initialize Default Settings

After deploying, you need to initialize the default settings once:

#### Option A: Via API (Recommended)
```bash
# Login as super admin first, then call:
POST /api/admin/settings
Content-Type: application/json
Body: { "action": "initialize" }
```

#### Option B: Via Settings Dashboard
1. Login as Super Admin
2. Go to Dashboard
3. Click "System Settings"
4. Click "Initialize Default Settings" button

This will create these default settings:
- **GST Percentage**: 18% (editable)
- **Platform Commission**: 20% (editable)
- **Auto-approve Designs**: false (editable)
- **Minimum Withdrawal**: ₹1,000 (editable)

### Step 2: Configure GST Percentage

1. Login as Super Admin
2. Navigate to **Dashboard → System Settings**
3. Find "GST Percentage" under "Tax Settings"
4. Update the value (e.g., 18, 12, 5, etc.)
5. Click "Save"

The pricing page will automatically reflect the new GST percentage!

---

## 📖 Usage Guide

### For Super Admin: Changing GST

**Via Settings Dashboard:**
1. Go to `/dashboard/settings`
2. Locate "GST Percentage" under Tax Settings
3. Enter new percentage (e.g., 18)
4. Click Save
5. Pricing page updates automatically

**Via API:**
```javascript
// Update GST to 12%
PUT /api/admin/settings
{
  "key": "gst_percentage",
  "value": 12
}
```

### For Pricing Page: Displaying Prices

The pricing page automatically:
1. Fetches GST percentage on load
2. Calculates: `Total Price = Base Price + (Base Price × GST%)`
3. Shows breakdown to users:
   - Base Price: ₹5,000
   - GST (18%): +₹900
   - **Total: ₹5,900**

---

## 🎯 Features

### Dynamic GST Calculation
```javascript
// Example for Basic Plan (₹600)
Base Price: ₹600
GST (18%): ₹108
Total: ₹708

// If admin changes GST to 12%
Base Price: ₹600
GST (12%): ₹72
Total: ₹672
```

### Real-time Updates
- Admin changes GST in settings
- All users see updated prices immediately
- No caching issues (fresh fetch on page load)

### Security
- Super Admin only access to modify settings
- JWT authentication required
- Role-based authorization
- Public endpoint only for reading GST (no auth)

---

## 📊 System Settings Available

| Setting | Default | Category | Description |
|---------|---------|----------|-------------|
| GST Percentage | 18% | Tax | GST applied on all purchases |
| Platform Commission | 20% | Payment | Commission from designer earnings |
| Auto-approve Designs | false | Design | Skip manual review |
| Minimum Withdrawal | ₹1,000 | Payment | Min designer withdrawal amount |

You can add more settings by modifying [SystemSettings.js:80-115](src/models/SystemSettings.js#L80-L115)

---

## 🔧 API Reference

### Get Public Settings (No Auth)
```javascript
GET /api/admin/settings?public=true

Response:
{
  "success": true,
  "settings": {
    "gst_percentage": 18
  }
}
```

### Get All Settings (Super Admin)
```javascript
GET /api/admin/settings
Authorization: Bearer <token>

Response:
{
  "success": true,
  "settings": [
    {
      "key": "gst_percentage",
      "value": 18,
      "rawValue": "18",
      "dataType": "number",
      "label": "GST Percentage",
      "description": "GST percentage to be applied...",
      "category": "tax",
      "isEditable": true,
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    // ... more settings
  ]
}
```

### Get Single Setting (Super Admin)
```javascript
GET /api/admin/settings?key=gst_percentage
Authorization: Bearer <token>

Response:
{
  "success": true,
  "setting": {
    "key": "gst_percentage",
    "value": 18,
    "label": "GST Percentage",
    // ... rest of fields
  }
}
```

### Update Setting (Super Admin)
```javascript
PUT /api/admin/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "gst_percentage",
  "value": 12
}

Response:
{
  "success": true,
  "message": "Setting updated successfully",
  "setting": {
    "key": "gst_percentage",
    "value": 12,
    "label": "GST Percentage",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### Initialize Defaults (Super Admin, One-time)
```javascript
POST /api/admin/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "initialize"
}

Response:
{
  "success": true,
  "message": "Default settings initialized successfully"
}
```

---

## 🧪 Testing

### Test 1: Initialize Settings
1. Login as Super Admin
2. Go to `/dashboard/settings`
3. Click "Initialize Default Settings"
4. Verify 4 default settings appear

### Test 2: Update GST
1. Change GST from 18% to 12%
2. Click Save
3. See success message
4. Go to `/pricing`
5. Verify all prices reflect 12% GST

### Test 3: Pricing Page
1. Open `/pricing` page
2. Check that prices show:
   - Base price
   - GST percentage
   - Total price
3. Verify calculation is correct

### Test 4: Public API
```bash
# Should work without authentication
curl https://yoursite.com/api/admin/settings?public=true

# Should return GST percentage
```

### Test 5: Authorization
```bash
# Should fail without super admin token
curl -X PUT https://yoursite.com/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"key": "gst_percentage", "value": 15}'

# Should return 401 Unauthorized
```

---

## 🐛 Troubleshooting

### Issue: Settings not appearing
**Solution**: Initialize default settings using the button or API endpoint

### Issue: Can't access settings page
**Solution**: Ensure you're logged in as Super Admin (role: 'super_admin')

### Issue: Pricing page shows default 18% GST
**Solution**:
1. Check if settings are initialized
2. Check browser console for API errors
3. Verify `/api/admin/settings?public=true` returns data

### Issue: GST not updating on pricing page
**Solution**:
1. Hard refresh the page (Ctrl+Shift+R)
2. Check if setting was saved successfully
3. Verify API response

---

## 🎨 Customization

### Add New Settings

Edit [SystemSettings.js:80-115](src/models/SystemSettings.js#L80-L115):

```javascript
{
  key: 'your_setting_key',
  value: 'default_value',
  dataType: 'number', // or 'string', 'boolean', 'json'
  label: 'Your Setting Label',
  description: 'What this setting does',
  category: 'tax', // or 'payment', 'general', etc.
  isEditable: true,
  isActive: true,
}
```

### Change GST Display Format

Edit [pricing/page.js:49-57](src/app/pricing/page.js#L49-L57) to customize the calculation display.

### Add More Categories

Edit [SystemSettings.js:32-35](src/models/SystemSettings.js#L32-L35) to add categories like 'notification', 'marketing', etc.

---

## 📈 Future Enhancements

Potential improvements you can add:
- [ ] History/audit log for setting changes
- [ ] Different GST rates for different states
- [ ] Bulk update settings
- [ ] Import/export settings
- [ ] Setting templates
- [ ] Role-based setting visibility
- [ ] Schedule setting changes (e.g., GST change on specific date)

---

## 🔐 Security Notes

1. **Super Admin Only**: Only users with `role: 'super_admin'` can modify settings
2. **JWT Authentication**: All admin endpoints require valid JWT token
3. **Public Endpoint**: Only GST is exposed publicly (read-only)
4. **Validation**: Data type validation before saving
5. **Audit Trail**: Last modified by user is tracked

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify super admin role in database
3. Check MongoDB connection
4. Review API logs for detailed errors

---

## ✅ Checklist

Before going live:
- [ ] Initialize default settings
- [ ] Set correct GST percentage for your region
- [ ] Test pricing page calculations
- [ ] Verify super admin access only
- [ ] Test on mobile devices
- [ ] Document GST changes for compliance

---

**System is ready! 🎉**

Your GST management system is fully functional. Super admins can now manage GST and other platform settings with ease.
