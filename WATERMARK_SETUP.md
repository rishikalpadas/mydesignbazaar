# Watermark Protection Setup Guide

## Problem
Users can still download unwatermarked preview images by:
1. Inspecting the page and finding the image URL
2. Downloading directly from `/api/uploads/designs/.../preview/...`

## Solution
Generate watermarked versions of all preview images on the server

---

## Implementation Steps:

### Step 1: Install Sharp Library
```bash
npm install sharp
```

### Step 2: The watermark utility has been created
Location: `src/lib/watermark.js`

### Step 3: Update Design Upload Process

When a designer uploads preview images, we need to:
1. Save the original (for admin verification)
2. Generate a watermarked version
3. Serve the watermarked version to public users

### Step 4: Modify Upload API

File: `src/app/api/uploads/[...path]/route.js`

Add this logic:
- If path contains `/preview/` → serve watermarked version
- If path contains `/raw/` → require authentication + subscription
- Admins always see originals

### Step 5: Update Design Upload Handler

File: `src/app/api/designs/upload/route.js`

After saving preview images:
```javascript
import { batchWatermark } from '@/lib/watermark';

// After upload, create watermarked versions
const watermarkPairs = previewImages.map(img => ({
  input: path.join(process.cwd(), 'public', 'uploads', 'designs', designId, 'preview', img.filename),
  output: path.join(process.cwd(), 'public', 'uploads', 'designs', designId, 'preview', 'watermarked', img.filename)
}));

await batchWatermark(watermarkPairs);
```

---

## Quick Fix (Temporary)

Until you install sharp, you can:

1. **Add download prevention headers** to uploads route
2. **Serve low-resolution previews** (resize images before saving)
3. **Add more aggressive CSS watermarks** (multiple layers)

---

## After Setup

Benefits:
✅ Downloaded images will have permanent watermarks
✅ Cannot be removed by inspecting page
✅ Protects designer's work
✅ Still allows buyers to preview before purchasing
✅ Admin can view originals for verification

---

## Commands to Run:

1. Install sharp:
```bash
npm install sharp
```

2. Test watermark generation:
```bash
node -e "const {addWatermarkToImage} = require('./src/lib/watermark.js'); addWatermarkToImage('test.jpg', 'test-watermarked.jpg')"
```

3. Restart development server:
```bash
npm run dev
```

---

## File Structure After Setup:

```
public/uploads/designs/FY12345/
├── preview/
│   ├── original-image.jpg          (original, admin only)
│   └── watermarked/
│       └── original-image.jpg      (watermarked, public)
└── raw/
    └── design-file.pdf             (requires subscription)
```

---

## Alternative Without Sharp

If you cannot install sharp, use this CSS-only approach (less secure):

1. Serve images through a proxy API that adds headers preventing download
2. Use multiple overlapping CSS watermarks
3. Serve lower resolution previews (800x600 max)
4. Add fingerprinting to track downloads

Would you like me to implement any of these alternatives?
