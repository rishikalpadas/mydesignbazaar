# Quick Start Guide - Designer Block/Delete System

## 🚀 What's Been Implemented

A complete system for admins to **block** or **delete** approved designer accounts with these key features:

### ✅ Block Feature
- Permanently blocks all designer credentials (email, phone, Aadhaar, PAN)
- Deletes all their uploaded designs
- Prevents them from re-registering with ANY of those credentials
- Sends email notification with reason

### ✅ Delete Feature
- Removes designer account completely
- Deletes all their uploaded designs
- ALLOWS them to re-register with the same credentials later
- Sends email notification with reason

## 📋 What You Need to Do (3 Simple Steps)

### Step 1: Update Designer Model Schema
**File:** `src/models/User.js`

Open the file and add these fields to the `designerSchema` (around line 128):

```javascript
// Account Status
accountStatus: {
  type: String,
  enum: ['active', 'blocked', 'deleted'],
  default: 'active',
},
blockedAt: Date,
blockedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
blockReason: String,
deletedAt: Date,
deletedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
deleteReason: String,
```

### Step 2: Update Registration Route
**File:** `src/app/api/auth/register/route.js`

**2a.** Add import at the top:
```javascript
import { validateRegistrationCredentials } from '../../../../middleware/blockedCredentialsCheck';
```

**2b.** Add credential check after line 11 (after `const { userType, email, password, ...profileData } = body;`):
```javascript
// Check if any credentials are blocked (only for designers)
if (userType === 'designer') {
  const validationResult = await validateRegistrationCredentials({
    userType,
    email,
    ...profileData
  });

  if (!validationResult.allowed) {
    return NextResponse.json(
      {
        error: 'Account Blocked',
        message: validationResult.message,
        blocked: true
      },
      { status: 403 }
    );
  }
}
```

### Step 3: Update Designers Dashboard Page
**File:** `src/app/dashboard/designers/page.js`

**3a.** Add imports at the top:
```javascript
import { Ban, Trash2 } from "lucide-react";
import BlockDeleteDesignerModal from "../../../components/dashboard/BlockDeleteDesignerModal";
```

**3b.** Add state variables (after line 27):
```javascript
const [blockModalOpen, setBlockModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedDesigner, setSelectedDesigner] = useState(null);
const [actionSuccess, setActionSuccess] = useState(null);
```

**3c.** Add handler functions (after line 71):
```javascript
const handleBlockClick = (designer) => {
  setSelectedDesigner(designer);
  setBlockModalOpen(true);
};

const handleDeleteClick = (designer) => {
  setSelectedDesigner(designer);
  setDeleteModalOpen(true);
};

const handleActionSuccess = (data) => {
  setActionSuccess({
    type: blockModalOpen ? 'block' : 'delete',
    message: data.message,
  });
  fetchDesigners();
  setTimeout(() => setActionSuccess(null), 5000);
};
```

**3d.** Replace the button section (lines 269-277) with:
```javascript
<div className="flex items-center space-x-2 ml-4">
  <button
    onClick={() => viewDesigner(designer._id)}
    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
  >
    <CheckCircle className="w-4 h-4 mr-2" />
    View
  </button>

  {designer.isApproved && (
    <>
      <button
        onClick={() => handleBlockClick(designer)}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        <Ban className="w-4 h-4 mr-2" />
        Block
      </button>

      <button
        onClick={() => handleDeleteClick(designer)}
        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </button>
    </>
  )}
</div>
```

**3e.** Add success message display (after line 166, before stats cards):
```javascript
{actionSuccess && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center">
      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
      <p className="text-green-700">
        <strong>Success:</strong> {actionSuccess.message}
      </p>
    </div>
  </div>
)}
```

**3f.** Add modals at the end (before the closing `</div>` around line 284):
```javascript
<BlockDeleteDesignerModal
  isOpen={blockModalOpen}
  onClose={() => {
    setBlockModalOpen(false);
    setSelectedDesigner(null);
  }}
  designer={selectedDesigner}
  actionType="block"
  onSuccess={handleActionSuccess}
/>

<BlockDeleteDesignerModal
  isOpen={deleteModalOpen}
  onClose={() => {
    setDeleteModalOpen(false);
    setSelectedDesigner(null);
  }}
  designer={selectedDesigner}
  actionType="delete"
  onSuccess={handleActionSuccess}
/>
```

## ✅ That's It!

After making these three updates:

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test the features:**
   - Go to your admin dashboard
   - Navigate to the designers page
   - You should see **Block** and **Delete** buttons next to approved designers
   - Try blocking a test designer (make sure to provide a reason)
   - Check that the email is sent
   - Try to register again with those blocked credentials - should be rejected
   - Try deleting a designer - they should be able to re-register

## 📁 Files Created (No Action Needed)

These files have already been created for you:

✅ `src/models/BlockedCredentials.js` - Tracks blocked credentials
✅ `src/lib/designerManagementService.js` - Business logic
✅ `src/lib/emailTemplates.js` - Email notifications
✅ `src/middleware/blockedCredentialsCheck.js` - Registration checks
✅ `src/app/api/admin/designers/block/route.js` - Block API
✅ `src/app/api/admin/designers/delete/route.js` - Delete API
✅ `src/components/dashboard/BlockDeleteDesignerModal.jsx` - UI Modal

## 🔧 Environment Variables

Make sure these are in your `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
MONGODB_URI=your-mongodb-uri
```

## 📖 Need More Details?

- **Full implementation details:** See `IMPLEMENTATION_SUMMARY.md`
- **Registration route specifics:** See `REGISTRATION_UPDATE_INSTRUCTIONS.md`
- **Dashboard page specifics:** See `DESIGNERS_PAGE_UPDATE_INSTRUCTIONS.md`

## 🐛 Troubleshooting

**Problem:** Email not sending
**Fix:** Check EMAIL_USER and EMAIL_APP_PASSWORD in .env

**Problem:** Blocked credentials not working
**Fix:** Make sure you completed Step 2 (registration route update)

**Problem:** Buttons not showing
**Fix:** Make sure you completed Step 3 (dashboard page update)

---

**Questions?** Check the detailed documentation files or review the code comments in the created files.
