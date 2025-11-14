# Slider Image Path Migration

## Problem
Previously, slider images were stored with relative paths like `/uploads/sliders/image.jpg` or full URLs like `https://mydesignbazaar.com/uploads/sliders/image.jpg`. This caused 404 errors in production because:

1. Next.js doesn't automatically serve files from `/uploads/...` in production
2. Images need to be served through the API route `/api/uploads/[...path]`
3. Full URLs with domains are environment-specific and don't work across dev/staging/prod

## Solution
Update all slider image paths to use the API route format: `/api/uploads/sliders/image.jpg`

## How to Run the Migration

### Local Environment:
```bash
npm run migrate:slider-paths
```

### Production Environment:
```bash
# SSH into your production server
ssh user@your-server

# Navigate to project directory
cd /path/to/mydesignbazaar

# Run migration
npm run migrate:slider-paths
```

## What the Migration Does

The migration script:
1. Connects to your MongoDB database
2. Finds all sliders
3. Updates image paths from:
   - `https://domain.com/uploads/sliders/image.jpg` → `/api/uploads/sliders/image.jpg`
   - `http://localhost:3000/uploads/sliders/image.jpg` → `/api/uploads/sliders/image.jpg`
   - `/uploads/sliders/image.jpg` → `/api/uploads/sliders/image.jpg`
4. Skips sliders that already use the correct format
5. Provides a summary of changes

## After Migration

After running the migration:
1. All existing sliders will use the API route path
2. New sliders will automatically use the API route path
3. Images will work correctly in all environments (dev, staging, production)

## Verification

To verify the migration worked:
1. Visit your website
2. Check that slider images are loading correctly
3. Open browser DevTools Network tab
4. Verify image requests go to `/api/uploads/sliders/...`

## Rollback

If you need to rollback (not recommended):
- The script doesn't delete old data
- You can manually update the `image` field in the database
- Or restore from a database backup
