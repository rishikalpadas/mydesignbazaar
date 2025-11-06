# Production Authentication Fix

## Problem Diagnosis
Getting 401 Unauthorized on `/api/user/profile` after login in production, while it works locally.

## Root Causes Identified

### 1. Environment Variables Missing in Production
The VPS server likely doesn't have the required environment variables set, especially:
- `JWT_SECRET` - Required for token verification
- `MONGODB_URI` - Database connection
- `NODE_ENV=production` - For proper cookie security

### 2. Cookie Security Settings
In production, cookies need different settings:
- `secure: true` (requires HTTPS)
- `sameSite: 'lax'` or `'strict'`
- Proper `domain` setting

### 3. CORS and Domain Issues
Production domain might have CORS or cookie domain restrictions.

## Immediate Steps to Fix

### Step 1: Verify Environment Variables on VPS
SSH into your VPS and check if environment variables are set:

```bash
# Check if variables exist
echo $JWT_SECRET
echo $MONGODB_URI
echo $NODE_ENV

# Or check all env vars
env | grep -E "(JWT_SECRET|MONGODB_URI|NODE_ENV)"
```

### Step 2: Set Missing Environment Variables
If variables are missing, set them on your VPS:

```bash
# Option A: Set in shell (temporary)
export JWT_SECRET="cebadbeb398dd90a6055644aea9cee7a527b25ff52568ddc369169e9beca318401884eb06df824963f2d2bba8a2263741b12d521f746e4b6532f92dfbcc0ac3b"
export MONGODB_URI="mongodb+srv://rishikalpadas:Zw9Cp0SyY17WiBse@cluster0.0whq45e.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
export NODE_ENV="production"

# Option B: Create .env.production file
nano .env.production
```

Add to `.env.production`:
```bash
JWT_SECRET=cebadbeb398dd90a6055644aea9cee7a527b25ff52568ddc369169e9beca318401884eb06df824963f2d2bba8a2263741b12d521f746e4b6532f92dfbcc0ac3b
MONGODB_URI=mongodb+srv://rishikalpadas:Zw9Cp0SyY17WiBse@cluster0.0whq45e.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://mydesignbazaar.com
EMAIL_USER=mydesignbazaarindia@gmail.com
EMAIL_APP_PASSWORD=ygircbeedhkvydzb
SMS_PROVIDER=msg91-whatsapp
```

### Step 3: Update Cookie Settings for Production Domain
Current cookie settings should work, but let's enhance them:

```javascript
// In login route.js - cookies should include domain for production
response.cookies.set("auth-token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true for HTTPS
  sameSite: "lax", // Works with HTTPS redirects
  maxAge: sessionDuration,
  path: "/",
  ...(process.env.NODE_ENV === "production" && { 
    domain: ".mydesignbazaar.com" // Include subdomain support
  })
})
```

### Step 4: Debug Steps

1. **Check if login actually sets cookie:**
   - Open browser DevTools → Network tab
   - Try logging in
   - Check if `Set-Cookie` header is present in login response

2. **Check if cookie is sent with profile request:**
   - Check the `/api/user/profile` request
   - Look for `Cookie` header with `auth-token`

3. **Check server logs:**
   ```bash
   # On VPS, check logs for errors
   pm2 logs  # if using PM2
   # or
   journalctl -u your-app-service -f
   ```

## Quick Test Commands

### Test Environment Variables:
```bash
# SSH into VPS and run:
node -e "console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING')"
node -e "console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'MISSING')"
node -e "console.log('NODE_ENV:', process.env.NODE_ENV)"
```

### Test MongoDB Connection:
```bash
# SSH into VPS, go to app directory and test:
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))
"
```

### Test JWT Secret:
```bash
# SSH into VPS and test JWT:
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({test: 'data'}, process.env.JWT_SECRET);
console.log('Token created:', !!token);
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Token verified:', !!decoded);
"
```

## Most Likely Solutions

### Solution 1: Missing JWT_SECRET (Most Common)
```bash
# On VPS, set the JWT secret:
export JWT_SECRET="cebadbeb398dd90a6055644aea9cee7a527b25ff52568ddc369169e9beca318401884eb06df824963f2d2bba8a2263741b12d521f746e4b6532f92dfbcc0ac3b"

# Then restart your app
pm2 restart all  # or however you restart your app
```

### Solution 2: Wrong MongoDB URI
```bash
# On VPS, set the correct MongoDB URI:
export MONGODB_URI="mongodb+srv://rishikalpadas:Zw9Cp0SyY17WiBse@cluster0.0whq45e.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"

# Restart app
pm2 restart all
```

### Solution 3: Cookie Domain Issues
If your site is behind a proxy or has subdomain issues, try this in login route:

```javascript
// Remove domain restriction temporarily for testing
response.cookies.set("auth-token", token, {
  httpOnly: true,
  secure: false, // Temporarily disable for testing
  sameSite: "lax",
  maxAge: sessionDuration,
  path: "/",
})
```

## Debugging in Browser

1. **Check login response:**
   - DevTools → Network → XHR
   - Click login
   - Check if response includes `Set-Cookie` header

2. **Check profile request:**
   - DevTools → Network → XHR  
   - Check `/api/user/profile` request
   - Look for `Cookie: auth-token=...` in request headers

3. **Check cookie storage:**
   - DevTools → Application → Cookies
   - Look for `auth-token` cookie under your domain

## Restart Steps After Fix

1. **Set environment variables** (JWT_SECRET, MONGODB_URI, NODE_ENV)
2. **Restart the application:**
   ```bash
   pm2 restart all
   # or
   systemctl restart your-app-service
   # or
   pkill node && npm start
   ```
3. **Clear browser cookies** and try login again
4. **Test with fresh incognito window**

## Expected Behavior After Fix

1. Login request returns 200 with `Set-Cookie` header
2. Cookie appears in browser DevTools
3. Subsequent `/api/user/profile` request includes cookie
4. Profile request returns 200 with user data (not 401)

The most likely issue is missing `JWT_SECRET` environment variable on the production server.